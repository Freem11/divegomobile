import { StyleSheet, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { getPhotosforMapArea } from "../../supabaseCalls/photoSupabaseCalls";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { activeFonts, colors, fontSizes } from "../styles";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import { SearchTextContext } from "../contexts/searchTextContext";
import { AreaPicsContext } from "../contexts/areaPicsContext";
import { MyCreaturesContext } from "../contexts/myCreaturesContext";
import { scale, moderateScale } from "react-native-size-matters";
import PhotoMenuListItem from "./photoMenuListItem";

let waiter2;
let numbPhotos = 0;

export default function PhotoMenu() {
  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
  const { myCreatures } = useContext(MyCreaturesContext);
  const { boundaries } = useContext(MapBoundariesContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);
  const { textvalue } = useContext(SearchTextContext);


  const [picMenuSize, setPicMenuSize] = useState(0);
  const [selectedID, setSelectedID] = useState(null);

  useEffect(() => {
    clearTimeout(waiter2);
  }, [animalMultiSelection]);

  numbPhotos = areaPics.length;

  useEffect(() => {
    setPicMenuSize(areaPics.length * moderateScale(120));
  }, []);

  useEffect(() => {
    setPicMenuSize(areaPics.length * moderateScale(120));
    xValue.value = 0;
  }, [areaPics.length]);

  const xValue = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  let bounds = scale(175);
  let startBounce = scale(170);

  const animatePicMenu = Gesture.Pan()
    .onBegin(() => {
      if (xValue.value > picMenuSize / 2 - bounds) {
        xValue.value = picMenuSize / 2 - startBounce;
      } else if (xValue.value < -picMenuSize / 2 + bounds) {
        xValue.value = -picMenuSize / 2 + startBounce;
      }
    })
    .onStart(() => {
      context.value = { x: xValue.value };
    })
    .onUpdate((event) => {
      if (event.velocityX > 400 || event.velocityX < -400) {
        xValue.value = event.translationX * 3 + context.value.x;
      } else if (event.velocityX > 600 || event.velocityX < -600) {
        xValue.value = event.translationX * 5 + context.value.x;
      } else {
        xValue.value = event.translationX + context.value.x;
      }
    })
    .onEnd((event) => {
      if (xValue.value > picMenuSize / 2 - bounds) {
        xValue.value = picMenuSize / 2 - startBounce;
      } else if (xValue.value < -picMenuSize / 2 + bounds) {
        xValue.value = -picMenuSize / 2 + startBounce;
      }
    });

  const animatedPictureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(xValue.value, {
            duration: 500,
            easing: Easing.inOut(Easing.linear),
          }),
        },
      ],
    };
  });

  const filterPhotosForMapArea = async () => {
    if (boundaries.length !== 0) {
      if (boundaries[0] > boundaries[2]) {
        try {
          const AmericanPhotos = await getPhotosforMapArea(
            {
              animal: textvalue,
              minLat: boundaries[1],
              maxLat: boundaries[3],
              minLng: -180,
              maxLng: boundaries[2],
            },
            myCreatures
          );
          const AsianPhotos = await getPhotosforMapArea(
            {
              animal: textvalue,
              minLat: boundaries[1],
              maxLat: boundaries[3],
              minLng: boundaries[0],
              maxLng: 180,
            },
            myCreatures
          );

          let photos = [...AsianPhotos, ...AmericanPhotos];

          if (photos) {
            const animalArray = Array.from(
              new Set(photos.map((a) => a.label))
            ).map((label) => {
              return photos.find((a) => a.label === label);
            });

            setAreaPics(animalArray);
          }
        } catch (e) {
          console.log({ title: "Error33", message: e.message });
        }
      } else {
        try {
          const photos = await getPhotosforMapArea(
            {
              animal: textvalue,
              minLat: boundaries[1],
              maxLat: boundaries[3],
              minLng: boundaries[0],
              maxLng: boundaries[2],
            },
            myCreatures
          );
          if (photos) {
            const animalArray = Array.from(
              new Set(photos.map((a) => a.label))
            ).map((label) => {
              return photos.find((a) => a.label === label);
            });

            setAreaPics(animalArray);
          }
        } catch (e) {
          console.log({ title: "Error22", message: e.message });
        }
      }
    }
  };

  useEffect(() => {
    filterPhotosForMapArea();
  }, []);

  useEffect(() => {
    filterPhotosForMapArea();
  }, [boundaries, textvalue]);

  return (
    <GestureDetector gesture={animatePicMenu}>
      <Animated.View
        style={[
          styles.container2,
          animatedPictureStyle,
          { minWidth: areaPics.length * moderateScale(120) },
        ]}
      >
        {areaPics &&
          areaPics.map((pic) => {
            return (
              <PhotoMenuListItem
                key={pic.id}
                pic={pic}
                setAnimalMultiSelection={setAnimalMultiSelection}
                animalMultiSelection={animalMultiSelection}
                setSelectedID={setSelectedID}
                selectedID={selectedID}
              />
            );
          })}
        {areaPics.length === 0 && <View style={styles.noSightings}></View>}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 90,
    elevation: 90,
    width: numbPhotos * moderateScale(120),
  },
  noSightings: {
    width: scale(200),
    alignItems: "center",
    textAlign: "center",
    marginTop: scale(15),
    fontFamily: activeFonts.Medium,
    fontSize: fontSizes.StandardText,
    color: colors.themeWhite,
  },
});
