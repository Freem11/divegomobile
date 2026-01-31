import {
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import React from "react";

import {
  colors,
} from "../../styles";
import ButtonIcon from "../../reusables/buttonIcon";
import { useAppNavigation } from "../../mapPage/types";

import * as S from "./styles";
import { usePinchAndZoomAnimation } from "./usePinchAndZoom";

const windowHeight = Dimensions.get("window").height;

type PinchAndZoomProps = {
  id?: number;
  photoFile: string;
};

export default function PhotoBoxModal(props: PinchAndZoomProps) {
  console.log("PhotoBoxModal rendered with props:", props);
  const navigation = useAppNavigation();

  const { gesture, animatedPictureStyle, animatedPictureFocalStyle } =
    usePinchAndZoomAnimation([props.photoFile]);

  const fileName = props.photoFile && props.photoFile.split("/").pop();
  let cacheDir = null;

  if (fileName) {
    cacheDir = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${fileName}`;
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
                console.log("Image load error:", e.nativeEvent.error);
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

