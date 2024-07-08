import {
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scale, moderateScale } from "react-native-size-matters";
import { PartnerModalContext } from "../../compnents/contexts/partnerAccountRequestModalContext";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { createPartnerAccountRequest } from "../../supabaseCalls/partnerSupabaseCalls";
import InputField from "../reusables/textInputs";
import SuccessModal from "./confirmationSuccessModal";
import FailModal from "./confirmationCautionModal";
import ModalHeader from "../reusables/modalHeader";
import SubmitButton from "../reusables/submitButton";

export default function PartnerAccountRequestModal() {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { partnerModal, setPartnerModal } = useContext(PartnerModalContext);
  const { profile } = useContext(UserProfileContext);
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
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("PartnerAccountButton");
    setLargeModalSecond(!largeModalSecond);
    setLargeModal(!largeModal)
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
      failBoxY.value = withTiming(scale(70));
      return;
    } else {
      createPartnerAccountRequest(formValues);
      successBoxY.value = withTiming(scale(70));
    }
  };

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText={"Partner Account Request"}
        onClose={handleClose}
        icon={null}
        altButton={null}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.explainer}>
          To qualify for a "Partner Account" Your Account must represent a
          diving business that takes divers out diving. {"\n"} Examples include:
          Dive Shops, Dive Charters, Diver Centres and Liveaboards
        </Text>

        <InputField
          validationItem={formValidation.BusinessNameVal}
          placeHolderText={"Full Business Name"}
          inputValue={formValues.BusinessName}
          keyboardType={"default"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, BusinessName: text })
          }
        />
        <Text style={styles.explainerMicro}>(For display purposes)</Text>

        <InputField
          validationItem={formValidation.WebsiteLinkVal}
          placeHolderText={"Website URL"}
          inputValue={formValues.WebsiteLink}
          keyboardType={"default"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, WebsiteLink: text })
          }
        />
        <Text style={styles.explainerMicro}>(To validate your business)</Text>

        <InputField
          validationItem={formValidation.LatVal}
          placeHolderText={"Latitude"}
          inputValue={formValues.Latitude}
          keyboardType={"numbers-and-punctuation"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, Latitude: text })
          }
        />
        <InputField
          validationItem={formValidation.LngVal}
          placeHolderText={"Longitude"}
          inputValue={formValues.Longitude}
          keyboardType={"numbers-and-punctuation"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, Longitude: text })
          }
        />
        <Text style={styles.explainerMicro}>(For map placement)</Text>

        <SubmitButton 
          buttonAction={() => handleSubmit(formValues)}
          label={"Submit Account Request"}
          />
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
    marginBottom: "2%",
    width: "98%",
    marginLeft: moderateScale(4),
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(-70),
    zIndex: -1,
  },
  explainer: {
    color: "#F0EEEB",
    fontSize: moderateScale(14),
    textAlign: "center",
    margin: moderateScale(20),
  },
  explainerMicro: {
    color: "#F0EEEB",
    fontSize: moderateScale(12),
    textAlign: "center",
  },
  confirmationBox: {
    width: "100%",
    position: "absolute",
    width: "100%",
  },
});
