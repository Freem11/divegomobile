import React from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles";

const windowWidth = Dimensions.get("window").width;

type ViewProps = {
  imageUri: string | null;
  isLoading: boolean;
  onPressUpload: () => void;
};

export default function WavyHeaderUploaderView({
  imageUri,
  isLoading,
  onPressUpload,
}: ViewProps) {
    
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.UploaderBackground>
        {imageUri && (
          <S.AddPhotoButton>
            <MaterialIcons
              name="add-a-photo"
              size={30}
              color={colors.themeWhite}
              onPress={onPressUpload}
            />
          </S.AddPhotoButton>
        )}

        {imageUri ? (
          <S.ImageBackgroundStyled source={{ uri: imageUri }}>
            {isLoading && (
              <S.SpinnerOverlay>
                <ActivityIndicator size="large" color="white" />
              </S.SpinnerOverlay>
            )}
          </S.ImageBackgroundStyled>
        ) : (
          <S.PhotoUploadButton onPress={onPressUpload}>
            <S.PhotoUploadText>
              {t("PicUploader.uploadButton")}
            </S.PhotoUploadText>
          </S.PhotoUploadButton>
        )}
      </S.UploaderBackground>

      <S.CurveWrapper pointerEvents="none">
        <Svg
          height={windowWidth > 600 ? "230%" : "230%"}
          width="100%"
          viewBox="0 0 1440 320"
          style={{
            flex: 1,
            marginLeft: windowWidth > 600 ? "0%" : 0,
            backgroundColor: "transparent",
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <Path
            fill="#ffffff"
            d="M 0,700 L 0,262 C 123.33333333333331,187.6 246.66666666666663,113.2 401,132 C 555.3333333333334,150.8 740.6666666666667,262.8 919,300 C 1097.3333333333333,337.2 1268.6666666666665,299.6 1540,102 L 1440, 2200 L 0,2200 Z"
          />
        </Svg>
      </S.CurveWrapper>
    </S.Container>
  );
}
