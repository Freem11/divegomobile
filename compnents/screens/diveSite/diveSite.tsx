import React, { useState, useContext, useEffect } from "react";
import { Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  colors,
} from '../../styles';
import * as S from "./styles";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import email from "react-native-email";
import {
  getDiveSitePhotos,
} from "../../../supabaseCalls/photoSupabaseCalls";
import {
  updateDiveSite,
} from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Label from "../../reusables/label";
import Icon from "../../../icons/Icon";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { Pagination } from "../../../entities/pagination";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

type DiveSiteProps = {
  bottomHitCount?: number;
  selectedDiveSite: DiveSiteWithUserName
};

export default function DiveSiteScreen({
  bottomHitCount,
  selectedDiveSite
}: DiveSiteProps) {
  
  const { profile } = useContext(UserProfileContext);

  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  const { t } = useTranslation();
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const [diveSitePics, setDiveSitePics] = useState([]);
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const getTrips = async () => {
    const success = await getItinerariesForDiveSite(selectedDiveSite.id);
  };

 
  const getPhotos = async (site, profile) => {

    const pagination = new Pagination({page: bottomHitCount, ipp: 10})
   
    const photos = await getDiveSitePhotos(
      site.lat,
      site.lng,
      profile.UserID,
      pagination
    );

    setDiveSitePics((prev) => prev ? [...prev, ...photos] : photos);
  };


  useEffect(() => {
    if (selectedDiveSite && profile) {
      getPhotos(selectedDiveSite, profile);
    }
  }, [selectedDiveSite, profile, bottomHitCount]);
  
  useEffect(() => {
    if (!isEditModeOn && selectedDiveSite) {
      diveSiteUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveSiteUpdateUpdate = async () => {
    try {
      const success = await updateDiveSite({
        id: selectedDiveSite.id,
        bio: selectedDiveSite && selectedDiveSite.divesitebio,
        photo: selectedDiveSite.divesiteprofilephoto,
      });
    } catch (e) {
      console.log({ title: "Error19", message: e.message });
    }
  };

  useEffect(() => {
    getTrips();
  }, [selectedDiveSite]);

  const handleEmailDS = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.name}" at Latitude: ${selectedDiveSite.lat} Longitude: ${selectedDiveSite.lng} `,
      body: "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const handleProfileMove = async (userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (profile.UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setActiveScreen("ProfileScreen", {id: picOwnerAccount[0].id})
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
  };

  const groupedPhotos = {};

  diveSitePics && diveSitePics.forEach(photo => {
    const key = `${photo.dateTaken}`;
    if (!groupedPhotos[key]) {
      groupedPhotos[key] = {
        dateTaken: photo.dateTaken,
        photos: [],
      };
    }
    groupedPhotos[key].photos.push(photo);
  });
  
  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.SiteNameContainer>
          <S.Header>{selectedDiveSite?.name}</S.Header>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginTop: "5%", marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </S.SiteNameContainer>

        <S.Contributor>Added by: {selectedDiveSite?.newusername}</S.Contributor>

        <S.Content>{selectedDiveSite?.divesitebio}</S.Content>

      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>

      {groupedPhotos && Object.values(groupedPhotos).map((photoPacket, index) => {
  return (
    <S.PhotoContainer key={`${photoPacket.dateTaken}-${index}`}>   
      <S.PacketHeader key={`${photoPacket.dateTaken}-${index}`}>

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
              profileViewAction={() => handleProfileMove(photo.UserName)}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}

