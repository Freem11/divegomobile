import React, { useRef, useState, useContext, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Image,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { activeFonts, colors, fontSizes } from '../styles';
import { scale, moderateScale } from "react-native-size-matters";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import emilio from '../png/guideIcons/EmilioNew.png'
import { registerForForegroundLocationTrackingsAsync } from "./locationTrackingRegistry";
import { registerForPhotoLibraryAccessAsync } from "./photoLibraryRegistery";
import { registerForPushNotificationsAsync } from "./notificationsRegistery";
import { SessionContext } from "../contexts/sessionContext";
import { PinContext } from "../contexts/staticPinContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile, grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import TextInputField from '../authentication/utils/textInput';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const screenHeight = Dimensions.get("screen").height;

export default function OnboardingTest() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(0);
  const { activeSession } = useContext(SessionContext);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setProfile } = useContext(UserProfileContext);
  const { t } = useTranslation();

  const carrouselData = useMemo(() => [
    {
      page: 1,
      title: t('OnBoarding.welcomeTitle'),
      content: t('OnBoarding.welcomeContent'),
      buttonOneText: t('Common.next'),
      buttonTwoText: null,
    },
    {
      page: 2,
      title: t('OnBoarding.diverNameTitle'),
      content: t('OnBoarding.diverNameContent'),
      buttonOneText: t('Common.ok'),
      buttonTwoText: null,
    },
    {
      page: 3,
      title: t('OnBoarding.locationTitle'),
      content: t('OnBoarding.locationContent'),
      buttonOneText: t('Common.accept'),
      buttonTwoText: t('Common.optOut'),
    },
    {
      page: 4,
      title: t('OnBoarding.galleryTitle'),
      content: t('OnBoarding.galleryContent'),
      buttonOneText: t('Common.accept'),
      buttonTwoText: t('Common.optOut'),
    },
    {
      page: 5,
      title: t('OnBoarding.notificationsTitle'),
      content: t('OnBoarding.notificationsContent'),
      buttonOneText: t('Common.accept'),
      buttonTwoText: t('Common.optOut'),
    },
    {
      page: 6,
      title: t('OnBoarding.doneTitle'),
      content: t('OnBoarding.doneContent'),
      buttonOneText: t('Common.finish'),
      buttonTwoText: null,
    },
  ], [t]);

  const onPress = async () => {
    if (carrouselIndex === 2) {
      let result = await handleSubmit();
      if (result === "success") {
        moveToNextPage();
      } else {
        return;
      }
    } else if (carrouselIndex === 3) {
      await registerForForegroundLocationTrackingsAsync();
      moveToNextPage();
    } else if (carrouselIndex === 4) {
      await registerForPhotoLibraryAccessAsync("no");
      moveToNextPage();
    } else if (carrouselIndex === 5) {
      await registerForPushNotificationsAsync(activeSession, "no");
      moveToNextPage();
    } else {
      moveToNextPage();
    }
  };

  const moveToNextPage = () => {
    if (carrouselIndex + 1 > carrouselData.length) {
      setFullScreenModal(false);
    } else {
      setCarrouselIndex(carrouselIndex + 1);
      const scrollToIndex = carrouselIndex;
      carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
    }
  };

  const [formVal, setFormVal] = useState({
    userName: "",
  });

  const [formValidation, SetFormValidation] = useState({
    userName: "",
  });

  const [userFail, setUserFail] = useState("");

  const handleText = async (text) => {
    setFormVal({ ...formVal, userName: text });
    setUserFail("");
    SetFormValidation({
      ...formValidation,
      userName: false,
    });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (formVal.userName === "" || formVal.userName === null) {
      userVar = true;
    } else {
      userVar = false;
    }

    SetFormValidation({
      ...formValidation,
      userName: userVar,
    });

    if (formVal.userName === "") {
      setUserFail(t('Validators.requiredDiverName'));
      return "fail";
    } else {
      let sessionUserId = activeSession.user.id;
      // let sessionUserId = 'a93f6831-15b3-4005-b5d2-0e5aefcbda13';
      try {
        await updateProfile({
          id: sessionUserId,
          username: formVal.userName,
        });
        let profileCheck = await grabProfileById(sessionUserId)
        console.log(profileCheck)
        if (profileCheck.length > 0) {
          setFormVal({ userName: "" });
          if (Array.isArray(profileCheck)) {
            setProfile(profileCheck);
          } else {
            setProfile([profileCheck]);
          }
          setPinValues({
            ...pinValues,
            UserId: profileCheck[0].UserID,
            UserName: profileCheck[0].UserName,
          });
          setAddSiteVals({
            ...addSiteVals,
            UserID: profileCheck[0].UserID,
            UserName: profileCheck[0].UserName,
          });
          return "success";
        } else {
          setUserFail(t('Validators.diverNameTaken'));
          return "fail";
        }
      } catch (e) {
        setUserFail(t('Validators.diverNameTaken'));
        console.log({ title: "Error19", message: e.message });
        return "fail";
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainter}
        ref={carrouselRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.page}
        data={carrouselData}
        renderItem={({ item }) => (
          <View key={item.page} style={styles.pageContent}>
            <Text style={styles.title}>{item.title}</Text>

            {item.page !== 2 ? (

              <MaskedView
                maskElement={
                  <LinearGradient
                    style={{ flex: 1 }}
                    colors={["green", "transparent"]}
                    start={{ x: 0.5, y: 0.7 }}></LinearGradient>
                }
              >
                <View style={styles.scrollViewBox}>
                  <ScrollView style={styles.scrollView}>
                    <Text style={styles.content}>{item.content}</Text>
                  </ScrollView>
                </View>
              </MaskedView>
            ) : (
              <Text style={styles.content}>{item.content}</Text>
            )}

            {item.page === 2 ? (
              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={moderateScale(150)}
                style={{ width: '100%', alignItems: 'center' }}
              >
                <View style={styles.inputBox}>
                  <TextInputField
                    icon={"scuba-diving"}
                    placeHolderText={t('OnBoarding.diverNamePlaceholder')}
                    inputValue={formVal.userName}
                    secure={false}
                    onChangeText={(text) => handleText(text)}
                  />
                </View>
              </KeyboardAvoidingView>
            ) : null}

            {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

            <View style={styles.imageBox}>
              <Image style={styles.image} source={emilio} />
            </View>

            <View style={styles.buttonBox}>
              <TouchableWithoutFeedback onPress={() => onPress()}>
                <View style={styles.buttonOne}>
                  <Text style={styles.buttonOneText}>{item.buttonOneText}</Text>
                </View>
              </TouchableWithoutFeedback>

              {item.buttonTwoText && (
                <TouchableWithoutFeedback onPress={() => moveToNextPage()}>
                  <View style={styles.buttonTwo}>
                    <Text style={styles.buttonTwoText}>
                      {item.buttonTwoText}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: screenHeight,
    width: windowWidth,
    backgroundColor: colors.primaryBlue,
    zIndex: 26,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "100%",
    height: windowHeight / 2,
    // marginTop: "10%",
    marginBottom: "2%",
    // backgroundColor: "lightblue",
  },
  pageContainter: {
    // alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    // backgroundColor: "green",
    height: windowHeight,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollViewBox: {
    height: windowHeight / 2.5,
    // backgroundColor: 'pink'
  },
  scrollView: {
    // backgroundColor: 'purple',
  },
  title: {
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.Header),
    paddingHorizontal: moderateScale(30),
    marginTop: windowHeight > 700 && windowWidth < 700 ? '-35%' : '-35%',
    marginBottom: moderateScale(10),
    width: windowWidth,
    color: colors.themeWhite,
    textAlign: "center",
  },
  content: {
    paddingTop: moderateScale(5),
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.StandardText),
    marginTop: moderateScale(15),
    width: windowWidth * 0.8,
    color: colors.themeWhite,
    textAlign: "center",
  },
  imageBox: {
    position: "absolute",
    bottom: moderateScale(0),
    right: moderateScale(0),
    pointerEvents: 'none'
  },
  image: {
    position: "absolute",
    bottom: moderateScale(95),
    right: moderateScale(-50),
    height: moderateScale(200),
    width: moderateScale(300),
    transform: [{ rotate: "3deg" }],
  },
  buttonBox: {
    // backgroundColor: 'pink',
    width: windowWidth * 0.85,
    height: moderateScale(70),
    position: "absolute",
    bottom: scale(20),
    borderTopWidth: moderateScale(1),
    borderTopColor: "lightgray",
    paddingTop: moderateScale(5),
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonTwo: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: colors.themeWhite,
  },
  buttonTwoText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(20),
    color: colors.themeWhite,
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  buttonOne: {
    borderRadius: moderateScale(10),
    backgroundColor: colors.themeWhite,
  },
  buttonOneText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(20),
    color: colors.primaryBlue,
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  erroMsg: {
    margin: moderateScale(5),
    marginLeft: screenHeight < 800 ? moderateScale(-110) : 0,
    width: screenHeight < 800 ? "50%" : "auto",
    textAlign: 'center',
    padding: moderateScale(7),
    paddingHorizontal: moderateScale(10),
    color: "pink",
    fontFamily: activeFonts.Thin,
    fontSize: scale(14),
    borderStyle: "dashed",
    borderRadius: moderateScale(10),
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: moderateScale(40),
  },
  inputBox: {
    width: "70%",
    marginTop: '-10%',
  },
});
