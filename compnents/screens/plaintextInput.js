import React, { useContext } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { activeFonts, colors } from "../styles";
import { UserProfileContext } from "../contexts/userProfileContext";

export default function PlainTextInput(props) {
  const {
    content,
    fontSz,
    isEditModeOn,
    setIsEditModeOn,
    isPartnerAccount,
    isMyShop,
    visitor,
    onChangeText,
    placeHolder,
  } = props;

  const { profile } = useContext(UserProfileContext);

  let checkPasser = false
  if(isPartnerAccount){
    checkPasser = isPartnerAccount
  } else if(isMyShop) {
    checkPasser = isMyShop
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeHolder}
        style={[
          styles.input,
          {
            backgroundColor: isEditModeOn && placeHolder && placeHolder.length < 100 ? "darkgrey" : colors.themeWhite,
            fontFamily: content ? activeFonts.Regular : activeFonts.Italic,
            textAlign: placeHolder && placeHolder.length > 100 ? "center": 'left'
          },
        ]}
        value={content}
        color={colors.themeBlack}
        editable={isEditModeOn ? true : false}
        fontSize={moderateScale(fontSz)}
        onChangeText={onChangeText}
        multiline={true}
      ></TextInput>
      {placeHolder && placeHolder.length > 100 || visitor || !checkPasser ? null :
      isEditModeOn ? (
        <FontAwesome6
          name="check"
          size={moderateScale(16)}
          color="green"
          onPress={() => setIsEditModeOn(false)}
          style={{ marginLeft: moderateScale(5) }}
        />
      ) : (
        <FontAwesome6
          name="pencil"
          size={moderateScale(16)}
          color="darkgrey"
          onPress={() => setIsEditModeOn(true)}
          style={{ marginLeft: moderateScale(5) }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: "10%",
  },
  input: {
    minWidth: moderateScale(40),
    maxWidth: "100%",
    flexWrap: "wrap",
    height: "auto",
  },
});
