import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import InsetShadow from "react-native-inset-shadow";
import { scale, moderateScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { PartnerModalContext } from "../../compnents/contexts/partnerAccountRequestModalContext";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { createPartnerAccountRequest } from "../../supabaseCalls/partnerSupabaseCalls";
import SuccessModal from "./confirmationSuccessModal";
import FailModal from "./confirmationCautionModal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PartnerAccountRequestModal() {
  const { partnerModal, setPartnerModal } = useContext(PartnerModalContext);
  const { profile, setProfile } = useContext(UserProfileContext);
  const [closeButtonState, setCloseButtonState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  useEffect(() => {
    setFormValues({ ...formValues, UserId: profile[0].UserID });
  }, []);

  const successBoxY = useSharedValue(scale(1200));
  const failBoxY = useSharedValue(scale(1200));

  const sucessModalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: successBoxY.value }],
    };
  });

  const cautionModalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: failBoxY.value }],
    };
  });

  const confirmationSucessClose = () => {
    successBoxY.value = withTiming(scale(1200));
  };

  const confirmationFailClose = () => {
    failBoxY.value = withTiming(scale(1200));
  };

  const [formValues, setFormValues] = useState({
    WebsiteLink: "",
    BusinessName: "",
    Latitude: "",
    Longitude: "",
    UserId: null,
  });

  let WebsiteLinkVar = false;
  let BusinessNameVar = false;
  let LatVar = false;
  let LngVar = false;

  const [formValidation, setFormValidation] = useState({
    WebsiteLinkVal: false,
    BusinessNameVal: false,
    LatVal: false,
    LngVal: false,
  });

  const handleClose = () => {
    setFormValues({
      ...formValues,
      WebsiteLink: "",
      BusinessName: "",
      Latitude: "",
      Longitude: "",
    });
    setPartnerModal(false)
  };

  const handleSubmit = (formValues) => {
    if (formValues.WebsiteLink === "" || formValues.WebsiteLink === null) {
      WebsiteLinkVar = true;
    } else {
      WebsiteLinkVar = false;
    }

    if (formValues.BusinessName === "" || formValues.BusinessName === null) {
      BusinessNameVar = true;
    } else {
      BusinessNameVar = false;
    }

    if (
      formValues.Latitude === "" ||
      formValues.Latitude === null ||
      isNaN(formValues.Latitude)
    ) {
      LatVar = true;
    } else {
      LatVar = false;
    }

    if (
      formValues.Longitude === "" ||
      formValues.Longitude === null ||
      isNaN(formValues.Longitude)
    ) {
      LngVar = true;
    } else {
      LngVar = false;
    }

    setFormValidation({
      ...formValidation,
      WebsiteLinkVal: WebsiteLinkVar,
      BusinessNameVal: BusinessNameVar,
      LatVal: LatVar,
      LngVal: LngVar,
    });

    if (
      formValues.WebsiteLink === "" ||
      formValues.BusinessName === "" ||
      formValues.Latitude == "" ||
      isNaN(formValues.Latitude) ||
      formValues.Longitude == "" ||
      isNaN(formValues.Longitude)
    ) {
      failBoxY.value = withTiming(scale(-50));
      return;
    } else {
      createPartnerAccountRequest(formValues);
      successBoxY.value = withTiming(scale(-50));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Partner Account Request</Text>
        <View
          style={
            closeButtonState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={handleClose}
            onPressIn={() => setCloseButtonState(true)}
            onPressOut={() => setCloseButtonState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.explainer}>
        To qualify for a "Partner Account" Your Account must represent a diving
        business that takes divers out diving. {"\n"} Examples include: Dive
        Shops, Dive Charters, Diver Centres and Liveaboards
      </Text>

      <InsetShadow
        containerStyle={{
          backgroundColor: formValidation.BusinessNameVal
            ? "pink"
            : "transparent",
          borderRadius: moderateScale(25),
          height: moderateScale(40),
          width: moderateScale(200),
          marginTop: moderateScale(20),
          alignItems: "center",
          justifyContent: "center",
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.3}
      >
        <TextInput
          style={
            formValidation.BusinessNameVal ? styles.inputRed : styles.input
          }
          value={formValues.BusinessName}
          placeholder={"Full Business Name"}
          placeholderTextColor="darkgrey"
          color={formValidation.BusinessNameVal ? "black" : "#F0EEEB"}
          fontSize={moderateScale(18)}
          multiline
          onChangeText={(bus) =>
            setFormValues({ ...formValues, BusinessName: bus })
          }
        ></TextInput>
      </InsetShadow>
      <Text style={styles.explainerMicro}>(For display purposes)</Text>

      <InsetShadow
        containerStyle={{
          backgroundColor: formValidation.WebsiteLinkVal
            ? "pink"
            : "transparent",
          borderRadius: moderateScale(25),
          height: moderateScale(40),
          width: moderateScale(200),
          marginTop: moderateScale(20),
          alignItems: "center",
          justifyContent: "center",
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.3}
      >
        <TextInput
          style={formValidation.WebsiteLinkVal ? styles.inputRed : styles.input}
          value={formValues.WebsiteLink}
          placeholder={"Website URL"}
          placeholderTextColor="darkgrey"
          color={formValidation.WebsiteLinkVal ? "black" : "#F0EEEB"}
          fontSize={moderateScale(18)}
          multiline
          onChangeText={(web) =>
            setFormValues({ ...formValues, WebsiteLink: web })
          }
        ></TextInput>
      </InsetShadow>
      <Text style={styles.explainerMicro}>(To validate your business)</Text>

      <InsetShadow
        containerStyle={{
          backgroundColor: formValidation.LatVal ? "pink" : "transparent",
          borderRadius: moderateScale(25),
          height: moderateScale(40),
          width: moderateScale(200),
          marginTop: moderateScale(20),
          alignItems: "center",
          justifyContent: "center",
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.3}
      >
        <TextInput
          style={formValidation.LatVal ? styles.inputRed : styles.input}
          value={formValues.Latitude}
          placeholder={"Latitude"}
          keyboardType="numbers-and-punctuation"
          fontSize={moderateScale(18)}
          placeholderTextColor="darkgrey"
          color={formValidation.LatVal ? "black" : "#F0EEEB"}
          multiline
          onChangeText={(lat) =>
            setFormValues({ ...formValues, Latitude: lat })
          }
        ></TextInput>
      </InsetShadow>

      <InsetShadow
        containerStyle={{
          backgroundColor: formValidation.LngVal ? "pink" : "transparent",
          borderRadius: moderateScale(25),
          height: moderateScale(40),
          width: moderateScale(200),
          marginTop: moderateScale(10),
          alignItems: "center",
          justifyContent: "center",
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.3}
      >
        <TextInput
          style={formValidation.LngVal ? styles.inputRed : styles.input}
          value={formValues.Longitude}
          placeholder={"Longitude"}
          keyboardType="numbers-and-punctuation"
          fontSize={moderateScale(18)}
          placeholderTextColor="darkgrey"
          color={formValidation.LngVal ? "black" : "#F0EEEB"}
          multiline
          onChangeText={(lng) =>
            setFormValues({ ...formValues, Longitude: lng })
          }
        ></TextInput>
      </InsetShadow>
      <Text style={styles.explainerMicro}>(For map placement)</Text>

      <View
        style={subButState ? styles.SubmitButtonPressed : styles.SubmitButton}
      >
        <TouchableOpacity
          onPress={() => handleSubmit(formValues)}
          onPressIn={() => setSubButState(true)}
          onPressOut={() => setSubButState(false)}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "gold",
              fontSize: moderateScale(26),
              marginTop: 4,
              marginBottom: -6,
              fontFamily: "PatrickHand_400Regular",
              width: "100%",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Submit Account Request
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.confirmationBox, sucessModalSlide]}>
        <SuccessModal
          submissionItem="partner account creation request"
          confirmationSucessClose={confirmationSucessClose}
          setPartnerModal={setPartnerModal}
        ></SuccessModal>
      </Animated.View>

      <Animated.View style={[styles.confirmationBox, cautionModalSlide]}>
        <FailModal
          submissionItem="partner account creation request"
          confirmationFailClose={confirmationFailClose}
        ></FailModal>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  explainer: {
    color: "#F0EEEB",
    fontSize: moderateScale(14),
    textAlign: "center",
    margin: moderateScale(20),
    marginTop: windowWidth > 500 ? 0 : moderateScale(-60),
  },
  explainerMicro: {
    color: "#F0EEEB",
    fontSize: moderateScale(12),
    textAlign: "center",
  },
  inputContainer: {
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: -150,
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginLeft: "12%",
    width: "85%",
    height: scale(30),
  },
  header2: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(24),
    alignSelf: "center",
    height: scale(70),
    color: "#F0EEEB",
    marginTop: "11%",
    marginLeft: "7%",
    marginRight: "10%",
    // backgroundColor: "green"
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  SubmitButton: {
    position: "absolute",
    marginBottom: "0%",
    borderTopWidth: 0.5,
    width: "85%",
    borderTopColor: "darkgrey",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
  },
  SubmitButtonPressed: {
    position: "absolute",
    marginBottom: "0%",
    borderTopWidth: 0.5,
    width: "85%",
    borderTopColor: "darkgrey",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
    backgroundColor: "#538dbd",
  },
  confirmationBox: {
    position: "absolute",
  },
});
