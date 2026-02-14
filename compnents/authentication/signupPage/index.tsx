import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { register } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { i18n } from "../../../i18n";
import { showWarning } from "../../toast";
import { useUserHandler } from "../../../store/user/useUserHandler";
import { AuthenticationRoutes } from "../authNavigator";

import CreateAccountPageView from "./view";
import { Form } from "./form";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "SignUp"
>;

interface IProps {
  moveToLandingPage: () => void;
  moveToLoginPage: () => void;
}

export default function SignUpScreen(props: IProps) {
  const userHandler = useUserHandler();

  const onSubmit = async(data: Form) => {

    const response = await register(data.Email, data.Password, data.Name);

    if (response.error) {
      console.log("Error: ", response.error);
      if (response.error.status === 422){
        showWarning(i18n.t("Validators.accountExistMsg"));
      } else {
        showWarning(i18n.t("Common.unknownError"));
      }
      return;
    }

    if (response.data.session) {
      userHandler.userInit(true);
    }
  };

  const navigation = useNavigation<SignUpScreenNavigationProp>();
  useLayoutEffect(() => {
    navigation.setOptions({ animation: "slide_from_left" });
  }, [navigation]);

  return (
    <CreateAccountPageView
      moveToLandingPage={() => navigation.goBack()}
      moveToLoginPage={() => navigation.replace("Login")}
      onSubmit={onSubmit}
    />
  );
}
