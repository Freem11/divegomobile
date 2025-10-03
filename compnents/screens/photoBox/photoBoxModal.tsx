import {
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  colors,
} from "../../styles";
import * as S from "./styles";
import * as FileSystem from "expo-file-system";
import { GestureDetector } from "react-native-gesture-handler";
import React, { useContext } from "react";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { SelectedPhotoContext } from "../../contexts/selectedPhotoContext";
import ButtonIcon from "../../reusables/buttonIcon";
import { usePinchAndZoomAnimation } from "./usePinchAndZoom";
import { useAppNavigation } from "../../mapPage/types";

const windowHeight = Dimensions.get("window").height;

export default function PhotoBoxModal() {
  const { fullScreenModal } = useContext(FullScreenModalContext);
  const { selectedPhoto } = useContext(SelectedPhotoContext);

  const navigation = useAppNavigation();

  const { gesture, animatedPictureStyle, animatedPictureFocalStyle } =
    usePinchAndZoomAnimation([selectedPhoto, fullScreenModal]);

  let fileName = selectedPhoto && selectedPhoto.split("/").pop();
  let cacheDir = null;

  if (fileName) {
    cacheDir = FileSystem.cacheDirectory + fileName;
  }

  return (
    <S.ContentContainer>
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={() => navigation.goBack()}
          size="small"
          fillColor={colors.themeWhite}
        />
      </S.BackButtonWrapper>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ rotate: "90deg" }],
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {cacheDir && (
            <Animated.Image
              source={{
                uri: cacheDir,
              }}
              onError={(e) => {
                console.log('Image load error:', e.nativeEvent.error);
              }}
              style={[
                animatedPictureStyle,
                {
                  width: windowHeight,
                  aspectRatio: 1,
                  borderRadius: 15,
                  resizeMode: "contain",
                },
              ]}
            />
          )}

          <Animated.View
            style={[styles.focalPoint, animatedPictureFocalStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </S.ContentContainer>
  );
}

const styles = StyleSheet.create({
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});


