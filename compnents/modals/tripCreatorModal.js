import { StyleSheet, View, Platform, Dimensions, Keyboard } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Share from "react-native-share";
import UserNamer from "../tutorial/usernamer";
import React, { useState, useContext, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { getProfileWithStats } from "../../supabaseCalls/accountSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputFieldLg from "../reusables/textInputLarge";
import InputFieldSm from "../reusables/textInputSmall";
import InputField from "../reusables/textInputs";
import ModalHeader from "../reusables/modalHeader";
import PrimaryButton from "../reusables/primaryButton";
import SubmitButton from "../reusables/submitButton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function TripCreatorModal() {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { profile } = useContext(UserProfileContext);
  const [nameChangerState, setNameChangerState] = useState(false);
  const [userFollows, setUserFollows] = useState(false);
  const { setProfileModal } = useContext(ProfileModalContext);
  const [userStats, setUserStats] = useState(null);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState("");

  const getProfile = async () => {
    let userID;
    if (selectedProfile) {
      userID = selectedProfile;
    } else {
      userID = profile[0].UserID;
    }

    try {
      const success = await getProfileWithStats(userID);
      if (success) {
        setUserStats(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const [formValues, setFormValues] = useState({
    BookingLink: "",
    TripName: "",
    StartDate: "",
    EndDate: "",
    Price: 0,
    TripDesc: "",
    DiveSites: [],
    ShopId: null,
  });

  const showDatePicker = (value) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    let formattedDate = moment(date).format("YYYY-MM-DD");

    if (dateType === "StartDate") {
      if (formValues.EndDate.length > 0 && formValues.EndDate < formattedDate) {
        return;
      }
    }

    if (dateType === "EndDate") {
      if (
        formValues.StartDate.length > 0 &&
        formValues.StartDate > formattedDate
      ) {
        return;
      }
    }

    setFormValues({ ...formValues, [dateType]: formattedDate });
    hideDatePicker();
  };

  const toggleTripCreatorModal = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TripCreator");
    setLargeModalSecond(false);
  };

  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText="Submit a new Trip"
        onClose={toggleTripCreatorModal}
      />

      <InputFieldLg
        placeHolderText={"Trip Name"}
        inputValue={formValues.TripName}
        keyboardType={"default"}
      />
      <InputFieldLg
        placeHolderText={"Booking Link"}
        inputValue={formValues.BookingLink}
        keyboardType={"default"}
      />

      <View style={styles.statsContainer}>
        <TouchableWithoutFeedback onPress={() => showDatePicker("StartDate")} style={{marginTop: moderateScale(-20), marginBottom: moderateScale(10)}}>
          <View pointerEvents="none">
            <InputField
              placeHolderText={"Start Date"}
              inputValue={formValues.StartDate}
              keyboardType={"default"}
              noPtEvents={true}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => showDatePicker("EndDate")} style={{marginTop: moderateScale(-20), marginBottom: moderateScale(10)}}>
          <View pointerEvents="none">
            <InputField
              placeHolderText={"End Date"}
              inputValue={formValues.EndDate}
              keyboardType={"default"}
              noPtEvents={true}
            />
          </View>
        </TouchableWithoutFeedback>

        <InputField
          placeHolderText={"Price"}
          inputValue={formValues.Price}
          keyboardType={"numbers-and-punctuation"}
        />
      </View>

      <PrimaryButton buttonAction={null} label={"Select Dive Sites"} />

      <SubmitButton buttonAction={handleSubmit} label={"Submit Trip"} />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    marginBottom: "2%",
    width: "100%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(30),
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10),
    width: "40%",
    // backgroundColor: "pink"
  },
  labelText: {
    marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    color: "white",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  statsContainer: {
    // backgroundColor: "pink",
    marginTop: moderateScale(20),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputSmall: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(16),
    color: "white",
  },
  ShareButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  ShareButtonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    marginBottom: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButtonPressed: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  userContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "18%" : "18%",
    left: "20%",
    backgroundColor: "transparent",
    alignItems: "center",
    height: "90%",
    width: "60%",
    borderRadius: 15,
    // backgroundColor: "green"
  },
  buttonContainer: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: moderateScale(110),
    marginTop: moderateScale(15),
  },
});
