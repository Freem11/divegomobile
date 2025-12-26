import React from "react";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";

import ButtonIcon from "../../reusables/buttonIcon";
import { activeFonts, colors } from "../../styles";

export default function AvatarTextInputField(props) {
    // eslint-disable-next-line react/prop-types
    const { avatarSource, inputValue, placeHolderText, onChangeText, secure, keyboardValue, handleClear } = props;
    return (
        <View style={styles.container}>
            <Image source={avatarSource} style={styles.image} />
            <TextInput
                style={styles.input}
                value={inputValue}
                placeholder={placeHolderText}
                placeholderTextColor="darkgrey"
                //color={colors.themeBlack}
                fontSize={moderateScale(18)}
                onChangeText={onChangeText}
                secureTextEntry={secure}
                keyboardType={keyboardValue}
                autoCapitalize="none"
                width={Platform.OS === "android" ? "75%" : "75%"}
            />
            <ButtonIcon
                icon="chevron-right"
                onPress={() => handleClear()}
                size="icon"
                fillColor={colors.darkGrey}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderColor: colors.border,
        borderWidth: moderateScale(1),
        alignItems: "center",
        backgroundColor: colors.themeWhite,
        borderRadius: moderateScale(8),
        padding: moderateScale(5),
        marginBottom: moderateScale(30),
    },
    image: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 10,
        borderWidth: 1,
    },
    input: {
        width: "83%",
        height: moderateScale(40),
        fontFamily: activeFonts.Regular,
    },
});
