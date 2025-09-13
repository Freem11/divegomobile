import React from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";

import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface IProps {
  formVals: { email: string };
  isEnabled: boolean;
  emailSent: string | null;
  setFormVals: (vals: { email: string }) => void;
  moveToLoginPage: () => void;
  passwordRecovery: (email: string) => void;
}

export default function ForgotPageView({
  formVals,
  isEnabled,
  emailSent,
  setFormVals,
  moveToLoginPage,
  passwordRecovery,
}: IProps) {
  const { t } = useTranslation();

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({});

  return (
    <S.Container>

      <AnimatedSafeAreaView style={[S.styles.safeArea]}>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={moveToLoginPage}
            size="small"
            fillColor={colors.neutralGrey}
          />
        </S.BackButtonWrapper>
      </AnimatedSafeAreaView>

      <S.Content>
        <S.Header>{t("Auth.resetPassword")}</S.Header>

        <Controller
          control={control}
          name="Email"
          rules={FormRules.Email}
          render={({ field: { onChange } }) => (
            <S.TopInputWrapper>
              <MobileTextInput
                error={errors.Email}
                iconLeft="at"
                placeholder={t("Auth.enterAccountEmail")}
                onChangeText={onChange}
              />
            </S.TopInputWrapper>
          )}
        />

        {emailSent ? <S.ErrorText>{emailSent}</S.ErrorText> : <S.ErrorText />}

        <S.ButtonBox>
          <Button
            onPress={isEnabled ? () => passwordRecovery(formVals.email) : () => { }}
            alt={false}
            size="medium"
            title={t("Auth.sendRecoverEmail")}
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}
