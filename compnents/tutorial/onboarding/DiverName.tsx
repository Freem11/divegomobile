import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import TextInputField from "../../authentication/utils/textInput";
import styles from "./styles"
import { useTranslation } from "react-i18next";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { updateProfileUserName, grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { SessionContext } from "../../contexts/sessionContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

type DiverNameScreenNavigationProp = NativeStackNavigationProp<
    OnboardingRoutes,
    "DiverName"
>;

export default function DiverNameScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<DiverNameScreenNavigationProp>();

    /**
     * For Android only.
     * If Android users have the 3 button Bottom system bar navigation enabled instead of gesture navigation, 
     * then we need to add additional space underneath the button(s) so that the button(s) do not overlap the Bottom system bar.
     */
    const insets = useSafeAreaInsets();
    const bottomInset: number | null = (insets.bottom > 0) ? insets.bottom : null;
    const buttonBottomPosition: number = (Platform.OS === 'android' && bottomInset) ? bottomInset : scale(20);

    const [formVal, setFormVal] = useState({
        userName: "",
    });

    const [userFail, setUserFail] = useState("");

    const { activeSession } = useContext(SessionContext);

    const { setProfile } = useContext(UserProfileContext);

    const handleSubmit = async () => {
        Keyboard.dismiss();

        if (formVal.userName === "") {
            setUserFail(t("Validators.requiredDiverName"));
            return "fail";
        }

        const profileCheck = await grabProfileByUserName(formVal.userName);
        if (profileCheck.length > 0) {
            setUserFail(t("Validators.diverNameTaken"));
            return "fail";
        }

        const sessionUserId = activeSession.user.id;

        const updatedProfile = await updateProfileUserName({
            UserID: sessionUserId,
            UserName: formVal.userName,
        });

        setProfile(updatedProfile);

        return "success";
    };

    const handleText = async (text) => {
        setFormVal({ ...formVal, userName: text });
        setUserFail("");
    };

    const onPress = async () => {
        const result = await handleSubmit();
        if (result === "success") {
            moveToNextPage();
        } else {
            return;
        }
    };

    const moveToNextPage = () => {
        navigation.replace("Location");
    }

    return (
        <View style={styles.pageContent}>
            <Text style={styles.title}>{t("OnBoarding.diverNameTitle")}</Text>
            <Text style={styles.content}>{t("OnBoarding.diverNameContent")}</Text>
            <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={moderateScale(150)}
                style={{ width: "100%", alignItems: "center" }}
            >
                <View style={styles.inputBox}>
                    <TextInputField
                        icon={"scuba-diving"}
                        placeHolderText={t("OnBoarding.diverNamePlaceholder")}
                        inputValue={formVal.userName}
                        secure={false}
                        onChangeText={(text) => handleText(text)}
                    />
                </View>
            </KeyboardAvoidingView>

            {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

            <View style={[styles.buttonBox, { bottom: buttonBottomPosition }]}>
                <TouchableWithoutFeedback onPress={() => onPress()}>
                    <View style={styles.buttonOne}>
                        <Text style={styles.buttonOneText}>{t("Common.ok")}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}
