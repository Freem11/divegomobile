import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, memo } from "react";
import ImageCasher from "../helpers/imageCashing";
import { scale, moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { activeFonts, colors } from "../styles";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";

const windowWidth = Dimensions.get("window").width;

const PhotoMenuListItem = (props) => {
  const {
    pic,
    setAnimalMultiSelection,
    animalMultiSelection,
    selectedID,
    setSelectedID,
  } = props;
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { tiles, setTiles } = useContext(CarrouselTilesContext);

  const handleSelect = (name) => {
    if (animalMultiSelection.includes(name)) {
      setAnimalMultiSelection(
        animalMultiSelection.filter((item) => item !== name)
      );
    } else {
      setAnimalMultiSelection([...animalMultiSelection, name]);
    }
    setFullScreenModal(false);
  };

  const scaleStart = useSharedValue(1);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const animatedPictureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleStart.value },
        { translateY: yPosition.value },
        { translateX: xPosition.value },
      ],
    };
  });

  const pressInAnimations = (data, id) => {
    setSelectedID(id);
    setFullScreenModal(false);

    if (scaleStart.value === 1) {
      let distanceToItemMiddle = moderateScale(60) - data.nativeEvent.locationX;
      let centererPress = data.nativeEvent.pageX + distanceToItemMiddle;
      let mover = (windowWidth / 2 - centererPress) / 3;

      scaleStart.value = withSpring(3);
      yPosition.value = withTiming(moderateScale(80));
      xPosition.value = withTiming(mover);
    } else {
      scaleStart.value = withTiming(1);
      yPosition.value = withTiming(0);
      xPosition.value = withTiming(0);
    }
  };

  const pressReleaseAnimations = () => {
    scaleStart.value = withTiming(1);
    yPosition.value = withTiming(0);
    xPosition.value = withTiming(0);
  };

  useEffect(() => {
    if (tiles) {
      pressReleaseAnimations();
      setTiles(false);
    }
  }, [tiles]);

  useEffect(() => {
    if (selectedID !== pic.id) {
      pressReleaseAnimations();
    }
  }, [selectedID]);

  let labelLength = pic.label.length;
  let labelFont = moderateScale(120) / labelLength + 6;

  return (
    <TouchableWithoutFeedback
      onPress={() => handleSelect(pic.label)}
      onLongPress={(data) => pressInAnimations(data, pic.id)}
      onFocus={() => pressReleaseAnimations()}
      key={pic.id}
    >
      <Animated.View
        style={[
          animalMultiSelection.includes(pic.label)
            ? styles.shadowboxSelected
            : styles.shadowbox,
          animatedPictureStyle,
        ]}
        key={pic.id}
      >
        <View style={{ justifyContent: "center", height: moderateScale(33) }}>
          <Text
            style={[
              animalMultiSelection.includes(pic.label)
                ? styles.photolabelSelected
                : styles.photolabel,
              { fontSize: labelFont },
            ]}
          >
            {pic.label}
          </Text>
        </View>
        <ImageCasher
          photoFile={pic.photoFile}
          id={pic.id}
          style={{
            height: moderateScale(70),
            minWidth: moderateScale(120),
            borderBottomRightRadius: moderateScale(14),
            borderBottomLeftRadius: moderateScale(14),
            resizeMode: "cover",
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  photolabel: {
    color: colors.themeWhite,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: moderateScale(120),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    paddingTop: moderateScale(3),
    fontFamily: activeFonts.Light,
    paddingLeft: moderateScale(5),
    paddingRight: moderateScale(5),
  },
  photolabelSelected: {
    fontSize: windowWidth > 600 ? scale(5) : scale(11),
    color: colors.themeBlack,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: moderateScale(120),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: moderateScale(3),
    fontFamily: activeFonts.Light,
    paddingLeft: moderateScale(5),
    paddingRight: moderateScale(5),
  },
  shadowbox: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    backgroundColor: colors.primaryBlue,
    height: moderateScale(105),
    zIndex: 20,
    elevation: 20,
  },
  shadowboxSelected: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    backgroundColor: colors.secondaryYellow,
    height: moderateScale(105),
    zIndex: 20,
    elevation: 20,
  },
});

export default memo(PhotoMenuListItem);
