import React, { useContext } from "react";
import {
  Alert,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import Button from '../../reusables/button';
import ButtonIcon from '../../reusables/buttonIcon'
import {
  signOut,
  userDelete
} from "../../../supabaseCalls/authenticateSupabaseCalls";
import {
  addDeletedAccountInfo,
  deleteProfile
} from "../../../supabaseCalls/accountSupabaseCalls";
import email from "react-native-email";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../../contexts/sessionContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useTranslation } from "react-i18next";
import * as S from "./styles";

export default function SettingsPage(props) {
  const { } = props;
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { activeSession, setActiveSession } = useContext(SessionContext);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  let profileType;
  if (profile.partnerAccount) {
    profileType = "Partner Account";
  } else {
    profileType = "Diver Account";
  }

  const openPartnerAccountScreen = () => {
    setLevelTwoScreen(true);
    setLevelOneScreen(false);
    setActiveScreen("PartnerRequestScreen");
  };

  const handleLogout = async () => {
    await setActiveSession(null);
    await SecureStore.deleteItemAsync("token");
    await signOut();
  };

  const alertHandler = async () => {
    Alert.alert(
      t('SettingsPage.aboutToDeleteAccountTitle'),
      t('SettingsPage.deleteAccountMessage'),
      [
        {
          text: t('SettingsPage.deleteAccountButton'),
          onPress: handleAccountDelete,
        },
        {
          text: t('SettingsPage.cancelDeleteButton'),
          onPress: () => console.log('no tapped'),
        },
        {
          text: t('SettingsPage.contactSupportButton'),
          onPress: handleEmail,
        },
      ]
    );
  };

  let blurb;
  let first;
  let last;

  if (activeSession) {
    first = activeSession.user.user_metadata.firstName || "";
    last = activeSession.user.user_metadata.lastName || "";
    blurb = `:${activeSession.user.id}` || null;
  }

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: `Delete Account Request ${blurb}`,
      body: "Hello I am deleting my Scuba SEAsons account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with Scuba SEAsons to allow these to stay in the app? (Y/N)",
      checkCanOpen: false
    }).catch(console.error);
  };

  const handleAccountDelete = async () => {
    if (blurb) {
      await addDeletedAccountInfo({
        firstName: first,
        lastName: last,
        email: activeSession.user.email,
        UserID: activeSession.user.id
      });

      await deleteProfile(activeSession.user.id);
      await userDelete(activeSession.user.id);
      await setActiveSession(null);
      await SecureStore.deleteItemAsync("token");
      await signOut();
    }
  };

  return (
    <S.ContentContainer>
      <S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={() => setLevelOneScreen(false)}
            size="small"
            fillColor={"darkgrey"}
          />
        </S.BackButtonWrapper>

      </S.SafeArea>

      <S.InputGroupContainer>
        <S.Header>{t('SettingsPage.header')}</S.Header>

        <S.SubHeader>
          {t('SettingsPage.subHeading')}
        </S.SubHeader>

        <S.DataHousing>
          {profileType === "Diver Account" ? (
            <>
            <S.DataLabels>{profileType}</S.DataLabels>
            <TouchableWithoutFeedback
              onPress={() => openPartnerAccountScreen()}
            >
              <S.PromptLinkText>
                {t('SettingsPage.notPartnerAccount')}
              </S.PromptLinkText>
            </TouchableWithoutFeedback>
            </>
          ) :  <S.DataLabelsAlt>{profileType}</S.DataLabelsAlt>}
        </S.DataHousing>

        <S.ButtonBox>
          <Button 
              onPress={() => handleLogout()}
              alt={false} 
              size='medium'
              title={t('SettingsPage.logout')} 
              iconRight="chevron-right"
            />
        </S.ButtonBox>
      </S.InputGroupContainer>

      <S.InputGroupContainerDanger>
            <S.SubHeaderDanger>
              {t('SettingsPage.dangerZoneBar')}
            </S.SubHeaderDanger>

            <TouchableWithoutFeedback onPress={alertHandler}>
                <S.DataHousingDanger>
                  <S.DataLabelsDanger>
                    {t('SettingsPage.delAccount')}
                  </S.DataLabelsDanger>
                </S.DataHousingDanger>
            </TouchableWithoutFeedback>
      </S.InputGroupContainerDanger>

    </S.ContentContainer>
  );
}