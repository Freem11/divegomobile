import React from "react";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import ButtonIcon from "../../reusables/buttonIcon";
import { activeFonts, colors } from "../../styles";

export default function TextInputField(props) {
    const {
        icon,
        placeHolderText,
        secure,
        setSecureTextEntry,
        inputValue,
        onChangeText,
        handleClear,
        animal,
        style = {},
        keyboardConfig
    } = props;

    let keyboardValue;

    if (keyboardConfig === "number-pad") {
        if (Platform.OS === "ios") {
            keyboardValue = "numbers-and-punctuation";
        }
    }

    if (!keyboardConfig) {
        keyboardValue = "default";
    }

    return (
        <View style={styles.container} {...style}>
            <ButtonIcon
                icon={icon}
                onPress={() => null}
                size="icon"
                fillColor={colors.darkGrey}
            />
            <TextInput
                style={styles.input}
                value={inputValue}
                placeholder={placeHolderText}
                placeholderTextColor="darkgrey"
                color={colors.themeBlack}
                fontSize={moderateScale(18)}
                onChangeText={onChangeText}
                secureTextEntry={secure}
                keyboardType={keyboardValue}
                autoCapitalize="none"
            />
            {placeHolderText === "Password" ? (
                <TouchableOpacity onPress={() => setSecureTextEntry(!secure)}>
                    <ButtonIcon
                        icon={secure ? "eye-slash" : "eye"}
                        onPress={() => null}
                        size="icon"
                        fillColor={colors.darkGrey}
                        style={{ marginLeft: moderateScale(1) }}
                    />
                </TouchableOpacity>
            ) : null}
            {(placeHolderText === "Sea Life Encountered" ||
        placeHolderText === "Search by Dive Site name or Location") &&
        animal?.length > 1 ? (
            <ButtonIcon
                        icon="close"
                        onPress={() => handleClear()}
                        size="icon"
                        fillColor={colors.darkGrey}
                    />
                ) : (
                    <View style={{ width: moderateScale(22) }}></View>
                )}

            {placeHolderText === "Blow some bubbles" ? (
                <ButtonIcon
                    icon="diving-snorkel"
                    onPress={() => handleClear()}
                    size="icon"
                    fillColor={colors.darkGrey}
                />
            ) : (
                <View style={{ width: moderateScale(22) }}></View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderBottomColor: "darkgrey",
        borderBottomWidth: moderateScale(2),
        alignItems: "center",
        backgroundColor: colors.themeWhite,
        borderRadius: moderateScale(5),
        alignItems: "center"
    },
    input: {
        width: "83%",
        height: moderateScale(40),
        fontFamily: activeFonts.Regular,
    },
});
