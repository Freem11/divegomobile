import React, { useContext, useEffect, useState, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";

import Card from "../../card";
import { AreaPicsContext } from "../../../../contexts/areaPicsContext";
import { getAnimalsInBubble } from "../../../../../supabaseCalls/photoSupabaseCalls";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { AnimalMultiSelectContext } from "../../../../contexts/animalMultiSelectContext";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";

import * as S from "./styles";

type SeaLifeListProps = {
  scrollToDiveSiteList?: () => void;
};

export default function SeaLifeList({ scrollToDiveSiteList }: SeaLifeListProps) {

  const boundaries = useMapStore((state) => state.gpsBubble);
  const [filterValue, setFilterValue] = useState("");
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
  const getPhotos = async(filterValue: string) => {
    if (boundaries) {
      const diveSiteData = await getAnimalsInBubble(boundaries, { label: filterValue } );

      setAreaPics(diveSiteData);
    }
  };

  useEffect(() => {
    getPhotos(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleAnimalSelect = (label: string) => {
    setAnimalMultiSelection((prev) => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleClear = () => {
    setFilterValue("");
  };

  const [layoutReady, setLayoutReady] = useState(false);

  const renderListHeader = useMemo(() => (
    <S.FilterContainer>
      <MobileTextInput
        iconLeft={"shark"}
        iconRight={"close"}
        placeholder="Filter Sea Creatures"
        onChangeText={(text: string) => setFilterValue(text)}
        handleClear={handleClear}
        filterValue={filterValue}
      />
    </S.FilterContainer>
  ), [filterValue, handleClear, setFilterValue]);

  return (
    <S.VerticalFlatlistContainer
      onLayout={() => {
        if (!layoutReady) setLayoutReady(true);
      }}
    >
      <S.Header>Nearby Sea Life</S.Header>
      {renderListHeader}

      {layoutReady ? (
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
              subData={`${item.times_seen} Sighting${item.times_seen !== 1 ? "s" : ""}`}
            />
          )}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={(
            <S.EmptyStateWrapper>
              <EmptyState
                iconName="fish"
                title="No Sea Life Sightings in this area!"
                subtitle={"Currently no one has submitted any sea life sightings in this area, if you have, please add it to the dive site you were diving at!"}
              />
              <Button
                size="thin"
                title={"Nearby Dive Sites"}
                iconLeft="fish"
                round={false}
                style={{ marginLeft: "10%", marginTop: moderateScale(15),  width: "80%" }}
                onPress={() => scrollToDiveSiteList()}
              />
            </S.EmptyStateWrapper>
          )}
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
};