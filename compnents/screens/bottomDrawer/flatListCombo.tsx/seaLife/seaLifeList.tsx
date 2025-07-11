import React, { useContext, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { FlatList, NativeViewGestureHandler } from "react-native-gesture-handler";

import Card from "../../card";
import { AreaPicsContext } from "../../../../contexts/areaPicsContext";
import { SearchTextContext } from "../../../../contexts/searchTextContext";
import { getAnimalsInBubble } from "../../../../../supabaseCalls/photoSupabaseCalls";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { AnimalMultiSelectContext } from "../../../../contexts/animalMultiSelectContext";

import * as S from "./styles";

const { width } = Dimensions.get("window");

export default function SeaLifeList({ horizontalGestureRef }) {

  const verticalGestureRef = useRef();

  const boundaries = useMapStore((state) => state.gpsBubble);
  const { textvalue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
  const getPhotos = async() => {
    if (boundaries) {
      const diveSiteData = await getAnimalsInBubble(boundaries);
 
      setAreaPics(diveSiteData);
    }
  };

  useEffect(() => {
    getPhotos();
  }, [boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng, textvalue]);


  const handleAnimalSelect = (label: string) => {
    setAnimalMultiSelection((prev) => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  return (
    <S.VerticalFlatlistContainer>
      <S.Header>Nearby Sea Life</S.Header>
      <NativeViewGestureHandler
        ref={verticalGestureRef}
        simultaneousHandlers={horizontalGestureRef}
      >
        <FlatList
          data={areaPics}
          keyExtractor={(item) => item.id?.toString() || item.photoFile || JSON.stringify(item)}
          renderItem={({ item }) => (
            <Card 
              id={item.id} 
              name={item.label} 
              photoPath={item.photofile} 
              onPressHandler={() => handleAnimalSelect(item.label)} 
              seaLifeSelections={animalMultiSelection} 
              subData={`${item.times_seen}  Sighting${item.times_seen !== 1 ? "s" : ""}`}
            />
          )}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        />
      </NativeViewGestureHandler>
    </S.VerticalFlatlistContainer>
  );
}



