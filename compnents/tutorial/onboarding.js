import React, { useRef, useState, useContext, useEffect } from "react";
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
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import carrouselData from "./carrouselData";
import emilio from '../png/guideIcons/EmilioNew.png'
import { registerForForegroundLocationTrackingsAsync } from "./locationTrackingRegistry";
import { registerForPhotoLibraryAccessAsync } from "./photoLibraryRegistery";
import { registerForPushNotificationsAsync } from "./notificationsRegistery";
import { SessionContext } from "../contexts/sessionContext";
import { PinContext } from "../contexts/staticPinContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";
import InputField from "../reusables/textInputs";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function OnboardingTest() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(0);
  const { activeSession } = useContext(SessionContext);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { profile, setProfile } = useContext(UserProfileContext);

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
      console.log("registered notifcations")
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
      setUserFail("Your diver name cannot be blank!");
      return "fail";
    } else {
      let sessionUserId = activeSession.user.id;
      // let sessionUserId = 'a93f6831-15b3-4005-b5d2-0e5aefcbda13';
      try {
        const success = await updateProfile({
          id: sessionUserId,
          username: formVal.userName,
        });
        if (success.length > 0) {
          setFormVal({ userName: "" });
          if (Array.isArray(success)) {
            setProfile(success);
          } else {
            setProfile([success]);
          }
          setPinValues({
            ...pinValues,
            UserId: success[0].UserID,
            UserName: success[0].UserName,
          });
          setAddSiteVals({
            ...addSiteVals,
            UserID: success[0].UserID,
            UserName: success[0].UserName,
          });
          return "success";
        } else {
          setUserFail("Sorry that diver name has already been taken");
          return "fail";
        }
      } catch (e) {
        setUserFail("Sorry that diver name has already been taken");
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

            {item.page === 1 ? (

              <MaskedView
              maskElement={
                <LinearGradient
                style={{flex: 1}}
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
              <View style={styles.inputBox}>
                <InputField
                  validationItem={formValidation.userName}
                  placeHolderText={"Diver Name"}
                  inputValue={formVal.userName}
                  keyboardType={"default"}
                  onChangeText={(text) => handleText(text)}
                />
              </View>
            ) : null}

            {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

            <Image style={styles.image} source={emilio} />

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
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "#0073E6",
    zIndex: 26,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "100%",
    height: windowHeight / 2,
    marginTop: "10%",
    marginBottom: "2%",
    // backgroundColor: "lightblue",
  },
  pageContainter: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    // backgroundColor: "green",
    height: windowHeight,
    width: windowWidth,
    alignItems: "center",
  },
  scrollViewBox: {
    height: windowHeight / 2.5,
    // backgroundColor: 'pink'
  },
  scrollView: {
    // backgroundColor: 'purple',
  },
  title: {
    fontFamily: "GothamBlack",
    fontSize: moderateScale(32),
    paddingHorizontal: moderateScale(30),
    marginTop: windowHeight > 700 && windowWidth < 700 ? scale(150) : scale(60),
    marginBottom: moderateScale(10),
    width: windowWidth,
    color: "#F0EEEB",
    textAlign: "center",
  },
  content: {
    paddingTop: moderateScale(5),
    fontFamily: "SanFran",
    fontSize: moderateScale(16),
    marginTop: moderateScale(15),
    width: windowWidth * 0.8,
    color: "#F0EEEB",
    textAlign: "center",
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
    borderColor: "white",
  },
  buttonTwoText: {
    fontFamily: "GothamBold",
    fontSize: moderateScale(20),
    color: "white",
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  buttonOne: {
    borderRadius: moderateScale(10),
    backgroundColor: "white",
  },
  buttonOneText: {
    fontFamily: "GothamBold",
    fontSize: moderateScale(20),
    color: "#538bdb",
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  erroMsg: {
    margin: moderateScale(5),
    marginLeft: windowHeight < 800 ? moderateScale(-110) : 0,
    width: windowHeight < 800 ? "50%" : "auto",
    textAlign: 'center',
    padding: moderateScale(7),
    paddingHorizontal: moderateScale(10),
    color: "pink",
    fontFamily: "Itim_400Regular",
    fontSize: scale(14),
    borderStyle: "dashed",
    borderRadius: moderateScale(10),
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: moderateScale(40),
  },
  inputBox: {
    marginTop: scale(30),
  },
});
