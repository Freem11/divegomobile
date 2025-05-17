import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Dimensions
} from "react-native";
import PlainTextInput from '../../reusables/plainTextInput';
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  authenicationButton,
  buttonTextAlt,
  buttonText
} from "../../styles";
import * as S from "./styles";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SessionContext } from "../../contexts/sessionContext";
import { getPhotosByUserWithExtra } from "../../../supabaseCalls/photoSupabaseCalls";
import { grabProfileByUserName, updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { registerForPushNotificationsAsync } from "../../tutorial/notificationsRegistery";
import { useButtonPressHelper } from "../../FABMenu/buttonPressHelper";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import {
  insertUserFollow,
  deleteUserFollow,
  checkIfUserFollows,
} from "../../../supabaseCalls/userFollowSupabaseCalls";
import { getProfileWithStats } from "../../../supabaseCalls/accountSupabaseCalls";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Icon from "../../../icons/Icon";
import Label from "../../reusables/label";
import { Photo } from "../../entities/photos";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";

const windowHeight = Dimensions.get("window").height;

type UserProfileProps = {
  onClose?: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  isMyShop?: boolean
};

export default function UserProfileScreen({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax,
  isMyShop
}: UserProfileProps) {
  const { profile } = useContext(UserProfileContext);
  const { activeSession } = useContext(SessionContext);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [isNotVisitor, setIsNotVisitor] = useState(true);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [userFail, setUserFail] = useState("");
  const [profileVals, setProfileVals] = useState(null);
  const [visitProfileVals, setVisitProfileVals] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState(null);
  const [followData, setFollowData] = useState(profile[0].UserID);
  const [userFollows, setUserFollows] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const { t } = useTranslation()

  const getPhotos = async () => {

    let success;
    if (selectedProfile && selectedProfile[0].UserID) {
      success = await getPhotosByUserWithExtra(
        selectedProfile[0].UserID,
        profile[0].UserID
      );
    } else {
      success = await getPhotosByUserWithExtra(
        profile[0].UserID,
        profile[0].UserID
      );
    }
    setProfilePhotos(success);
  };

  const getFollowStatus = async () => {
    if (!selectedProfile || selectedProfile[0].UserID === profile[0].UserID) {
      setVisitProfileVals(null);
      setIsNotVisitor(true)
    } else {
      setIsNotVisitor(false)
      setVisitProfileVals({
        id: selectedProfile[0].UserID,
        userName: selectedProfile[0].UserName,
        bio: selectedProfile[0].profileBio,
        photo: selectedProfile[0].profilePhoto,
      });
    }

    setProfileVals({
      id: profile[0].UserID,
      userName: profile[0].UserName,
      bio: profile[0].profileBio,
      photo: profile[0].profilePhoto,
    });
    setTempUserName(profile[0].UserName);

  };


  useEffect(() => {
    getPhotos();
    getFollowStatus();
  }, [selectedProfile]);


  useEffect(() => {
    setUserFail("");

    if (!isEditModeOn && profileVals) {
      profileUpdate();
    }
  }, [isEditModeOn]);

  const profileUpdate = async () => {
    if (profileVals.userName === "") {
      setUserFail(t('Validators.requiredDiverName'));
      setProfileVals({ ...profileVals, userName: tempUserName });
    } else {
      try {
        const success = await updateProfile({
          id: profileVals.id,
          username: profileVals.userName,
          bio: profileVals.bio,
          photo: profileVals.profilePhoto,
        });
        if (success.length === 0 && profileVals) {
          setProfileVals({ ...profileVals, userName: tempUserName });
          setUserFail(t('Validators.userNameTaken'));
        }
      } catch (e) {
        setProfileVals({ ...profileVals, userName: tempUserName });
        setUserFail(t('Validators.userNameTaken'));
        console.log({ title: "Error19", message: e.message });
      }
    }
  };

  const handleFollow = async () => {

    let permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
    if (!permissionGiven) {
      return
    }

    if (userFollows) {
      deleteUserFollow(followData);
      setUserFollows(false);
    } else {
      if (userStats) {
        let newRecord = await insertUserFollow(
          profile[0].UserID,
          userStats[0].userid
        );
        setFollowData(newRecord[0].id);
        setUserFollows(true);
      }
    }
  };

  const handleDiveSiteMove = async (pic: Photo, photoPacket) => {
    setSelectedDiveSite({
      SiteName: photoPacket.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    closeParallax(1)
    setLevelTwoScreen(false);
  };

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>

      {/* {visitProfileVals ? (
        <TouchableWithoutFeedback onPress={() => handleFollow()}>
          <View style={userFollows ? styles.followButtonAlt : styles.followButton}>
            <Text style={userFollows ? styles.followButtonTextAlt : styles.followButtonText}>{userFollows ? t('UserProfile.userDoesFollow') : t('UserProfile.UserDoesNotFollow')}</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.settingsButton}>
          <MaterialIcons
            name="settings"
            size={moderateScale(46)}
            color={colors.themeWhite}
            onPress={openSettings}
          />
        </View>
      )}
      {visitProfileVals ? null : (
        <View style={styles.addPhotoButton}>
          <MaterialIcons
            name="add-a-photo"
            size={moderateScale(30)}
            color={colors.themeWhite}
            onPress={() => handleImageUpload()}
          />
        </View>
      )} */}

        <S.UserNameContainer>
          <S.Header>{selectedProfile[0].UserName}</S.Header>
        </S.UserNameContainer>
   
             {selectedProfile && (
                <PlainTextInput
                  placeholder={`A little about ${selectedProfile[0].UserName}`}
                  value={selectedProfile[0].profileBio}
                  isMyShop={isMyShop}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setSelectedProfile({ ...selectedProfile, profileBio: bioText })
                  }
                />
              )} 

      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>
        
      {profilePhotos && profilePhotos.map((photoPacket, index) => {
  return (
    <S.PhotoContainer key={`${photoPacket.id}-${index}`}>   
      <S.PacketHeader key={`${photoPacket.id}-${index}`}>
  
      <S.HeaderWrapper>
        <S.IconWrapper>
          <Icon name={'anchor'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

          <S.PacketHeaderItem>{photoPacket.name}</S.PacketHeaderItem>
      </S.HeaderWrapper>

      <S.HeaderWrapper>
        <S.IconWrapper>
          <Icon name={'calendar-month'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

          <S.PacketHeaderItem>{photoPacket.dateTaken}</S.PacketHeaderItem>
      </S.HeaderWrapper>

      </S.PacketHeader>

      {photoPacket.photos.length > 0 &&
        photoPacket.photos.map((photo, index) => {
          return (
            <SeaLifeImageCard
              key={`${photo.id}-${index}`}
              pic={photo}
              dataSetType={"DiveSitePhotos"}
              diveSiteName={photoPacket.name}
              diveSiteAction={() => handleDiveSiteMove(photo, photoPacket)}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}

const styles = StyleSheet.create({
  followButton: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    screenSecondaryButton,
  ],
  followButtonAlt: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    authenicationButton,
  ],
  followButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
  followButtonTextAlt: [buttonText, { marginHorizontal: moderateScale(5) }],
});
