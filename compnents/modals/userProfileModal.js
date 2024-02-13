import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  // Share
} from "react-native";
import Share from "react-native-share";
import React, { useState, useContext, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { findImageInCache, cacheImage } from "../helpers/imageCashingHelper";
import InsetShadow from "react-native-inset-shadow";
import { scale, moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImgToBase64 from "react-native-image-base64";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default function UserProfileModal() {
  const { profile, setProfile } = useContext(UserProfileContext);
  const [profileCloseState, setProfileCloseState] = useState(false);
  const [imaButState, setImaButState] = useState(false);
  const [picUri, setPicUri] = useState(null);
  const { profileModal, setProfileModal } = useContext(
    ProfileModalContext
  );

  let fileName = `/Headliner.jpg`
  let cacheDir = FileSystem.cacheDirectory + fileName;

  let image = {
    uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/Headliner.jpg`,
    // uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/animalphotos/public/Headliner.jpg`,
    id : fileName
  };

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      // console.log("callback?", progress)
      // setIsDownloaded(progress)
  };

  useEffect(() => {
    getProfile();

    async function loadImage() {
      let imageExisitsInCache = await findImageInCache(cacheDir);
      // console.log("this?", imageExisitsInCache)
        if (imageExisitsInCache.exists) {
          setPicUri(cacheDir);
        } else {
          let cashing = await cacheImage(image.uri, cacheDir, callback);
          // console.log("that?", cashing)
          if (cashing.cached) {
            setPicUri(cashing.path);
          } else {
            // console.log("main", cashing.cached)
            setPicUri(image.uri);
          }
        }
    }

    loadImage();

  }, []);



  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        setProfile(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const toggleProfileModal = () => {
    setProfileModal(false)
  }

  let username = ""
  let email = ""

  if (profile[0]){
    username = profile[0].UserName
    email = profile[0].Email
  }

const [base64, setBase64] = useState(null);

const convertBase64 = (cashed) => {
  ImgToBase64.getBase64String(cashed)
    .then((base64String) => {
      setBase64(base64String);
    })
    .catch((err) => {
      console.log(err);
    });
};

const doShare = async (shareOptions) => {
  try {
    const response = await Share.open(shareOptions);
  } catch (error) {
    console.log(error);
  }
};

const onShare = async (photoFile) => {
  let temp = photoFile.split("/");
  let lastIndex = temp.length -1
  let fileName = temp[lastIndex];
  let cacheDirectory = FileSystem.cacheDirectory + fileName;
  convertBase64(cacheDirectory);
};

useEffect(() => {
  let localUri = `https://divegolanding.web.app`

  const shareOptions = {
    message: "",
    url: "",
  };
  if (base64) {
    shareOptions.message = `Checkout Scuba SEAsons! \nA great app to help divers find the best place and time of year to dive with ANY sea creature!\nRight now they are looking for contributors to add their dive sites and sea creature photos!\n\nLearn more about it here: ${localUri}`;
    shareOptions.url = `data:image/jpg;base64,${base64}`;
    doShare(shareOptions);
  }
  setBase64(null)
}, [base64]);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header}>My Diver Profile</Text>
        <View
          style={
            profileCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={toggleProfileModal}
            onPressIn={() => setProfileCloseState(true)}
            onPressOut={() => setProfileCloseState(false)}
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

      <View style={styles.inputContainer}>

      <InsetShadow
          containerStyle={{
            borderRadius: moderateScale(25),
            height: moderateScale(40),
            width: moderateScale(200),
            marginRight: 18,
            marginTop: moderateScale(10),
            // paddingTop: 3
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={styles.input}
            value={username}
            placeholder={"DiverName"}
            keyboardType="numbers-and-punctuation"
            editable={false}
            fontSize={moderateScale(14)}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            multiline
            // onChangeText={(text) =>
            //   setAddSiteVals({ ...addSiteVals, Latitude: text })
            // }
          ></TextInput>
        </InsetShadow>

        <InsetShadow
          containerStyle={{
            borderRadius: moderateScale(25),
            height: moderateScale(40),
            width: moderateScale(200),
            marginRight: 18,
            marginTop: moderateScale(10),
            // paddingTop: 3

          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={styles.input}
            value={email}
            placeholder={"Email"}
            keyboardType="numbers-and-punctuation"
            editable={false}
            fontSize={moderateScale(14)}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            multiline
            // onChangeText={(text) =>
            //   setAddSiteVals({ ...addSiteVals, Latitude: text })
            // }
          ></TextInput>
        </InsetShadow>

        <View style={imaButState ? styles.ShareButtonPressed : styles.ShareButton}>
        <TouchableOpacity
          onPress={() => onShare(picUri)}
          onPressIn={() => setImaButState(true)}
          onPressOut={() => setImaButState(false)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // width: scale(100),
            height: scale(35),
            alignItems: "center",
            marginLeft: scale(10),
            marginRight: scale(10)
          }}
        >
          <FontAwesome name="share-square-o" size={moderateScale(24)} color="gold" />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: "PatrickHand_400Regular",
              color: "gold",
              fontSize: moderateScale(14)
            }}
          >
            Share Scuba SEAsons!
          </Text>
        </TouchableOpacity>
      </View>

      </View>
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
  inputContainer: {
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
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
    marginTop: "2%",
    marginLeft: "12%",
    width: "80%",
    height: scale(30),
  },
  header: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "7%",
    marginRight: "15%",
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
  ShareButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(40),
    marginLeft: "30%",
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
    borderRadius: moderateScale(10),
    height: moderateScale(40),
    marginLeft: "30%",
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
});
