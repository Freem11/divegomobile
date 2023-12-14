import { StyleSheet, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { multiHeatPoints } from "../../supabaseCalls/heatPointSupabaseCalls";
import { getPhotosforMapArea } from "../../supabaseCalls/photoSupabaseCalls";
import { getPhotosforAnchorMulti } from "../../supabaseCalls/photoSupabaseCalls";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { AnchorPhotosContext } from "../contexts/anchorPhotosContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { HeatPointsContext } from "../contexts/heatPointsContext";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import { SearchTextContext } from "../contexts/searchTextContext";
import { AreaPicsContext } from "../contexts/areaPicsContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { scale } from "react-native-size-matters";
import { formatHeatVals } from "../helpers/mapHelpers";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import PhotoMenuListItem from "./photoMenuListItem";

let waiter2;

export default function PhotoMenu() {
  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
  const { selectedDiveSite, setSelectedDiveSite } = useContext(
    SelectedDiveSiteContext
  );
  const { boundaries } = useContext(MapBoundariesContext);
  const { setNewHeat } = useContext(HeatPointsContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);
  
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { textvalue, setTextValue } = useContext(SearchTextContext);

  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const { anchPhotos, setAnchPhotos } = useContext(AnchorPhotosContext);
  
  const [picMenuSize, setPicMenuSize] = useState(0);
  const [selectedID, setSelectedID] = useState(null);

  const filterAnchorPhotos = async () => {

    console.log("step 1", selectedDiveSite)
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    console.log("step 2", animalMultiSelection, minLat, maxLat, minLng, maxLng)
    try {
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        setAnchPhotos(photos);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    clearTimeout(waiter2);

    if (tutorialRunning) {
      if (itterator === 18) {
        waiter2 = setTimeout(() => {
          setItterator(itterator + 2);
          setSiteModal(true)
        }, 2000);
      }
    }
  }, [animalMultiSelection]);


  useEffect(() => {
    setPicMenuSize(areaPics.length * 120);
  }, []);

  useEffect(() => {
    setPicMenuSize(areaPics.length * 120);
    xValue.value = 0;
  }, [areaPics.length]);

  const xValue = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const animatePicMenu = Gesture.Pan()
    .onBegin(() => {
      if (xValue.value > picMenuSize / 2 - 180) {
        xValue.value = picMenuSize / 2 - 175;
      } else if (xValue.value < -picMenuSize / 2 + 180) {
        xValue.value = -picMenuSize / 2 + 175;
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
      if (xValue.value > picMenuSize / 2 - 180) {
        xValue.value = picMenuSize / 2 - 175;
      } else if (xValue.value < -picMenuSize / 2 + 180) {
        xValue.value = -picMenuSize / 2 + 175;
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
        const AmericanPhotos = await getPhotosforMapArea({
          animal: textvalue,
          minLat: boundaries[1],
          maxLat: boundaries[3],
          minLng: -180,
          maxLng: boundaries[2],
        });
        const AsianPhotos = await getPhotosforMapArea({
          animal: textvalue,
          minLat: boundaries[1],
          maxLat: boundaries[3],
          minLng: boundaries[0],
          maxLng: 180,
        });

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
        console.log({ title: "Error", message: e.message });
      }
    } else {
      try {
        const photos = await getPhotosforMapArea({
          animal: textvalue,
          minLat: boundaries[1],
          maxLat: boundaries[3],
          minLng: boundaries[0],
          maxLng: boundaries[2],
        });
        if (photos) {
          const animalArray = Array.from(
            new Set(photos.map((a) => a.label))
          ).map((label) => {
            return photos.find((a) => a.label === label);
          });

          setAreaPics(animalArray);
        }
      } catch (e) {
        console.log({ title: "Error", message: e.message });
      }
    }
  }
  };

  const filterHeatPointsForMapArea = async () => {

    if (boundaries.length !== 0) {

      try {
        const localHeatPoints = await multiHeatPoints(
          {
            minLat: boundaries[1],
            maxLat: boundaries[3],
            minLng: boundaries[0],
            maxLng: boundaries[2],
          },
          animalMultiSelection
        );
        if (localHeatPoints) {
          setNewHeat(formatHeatVals(localHeatPoints));
        }
      } catch (e) {
        console.log({ title: "Error", message: e.message });
      }
    } 
  };

  useEffect(() => {
    filterPhotosForMapArea();
  }, []);

  useEffect(() => {
    filterHeatPointsForMapArea();
  }, [setAnimalMultiSelection]);

  useEffect(() => {
    filterPhotosForMapArea();
  }, [boundaries, textvalue]);


  return (
    <GestureDetector gesture={animatePicMenu}>
      <Animated.View
        style={[
          styles.container2,
          animatedPictureStyle,
          { minWidth: areaPics.length * 120 },
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
                // yPosition={yPosition}
              />
            );
          })}
          {areaPics.length === 0 && (
            <View style={styles.noSightings}></View>
          )}
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
    elevation: 90
  },
  picContainer2: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    // marginTop: scale(10),
  },

  titleText: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(12),
  },
  noSightings: {
    width: scale(200),
    alignItems: "center",
    textAlign: "center",
    marginTop: scale(15),
    fontFamily: "Itim_400Regular",
    fontSize: scale(15),
    color: "#F0EEEB",
  },
});
