import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import Card from "../../card";
import { getAnimalsInBubble } from "../../../../../supabaseCalls/photoSupabaseCalls";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { AnimalMultiSelectContext } from "../../../../contexts/animalMultiSelectContext";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";
import * as S from "../styles";
import Icon from "../../../../../icons/Icon";
import { colors } from "../../../../styles";
import { useAppNavigation } from "../../../../mapPage/types";
import getImagePublicUrl from "../../../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../../../entities/image";

type SeaLifeListProps = {
  scrollToDiveSiteList?: () => void;
};

export default function SeaLifeList({ scrollToDiveSiteList }: SeaLifeListProps) {
  const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const [filterValue, setFilterValue] = useState("");
  const [areaPics, setAreaPics] = useState([]);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const getPhotos = async (val: string) => {
    if (boundaries) {
      const diveSiteData = await getAnimalsInBubble(boundaries, { label: val });
      setAreaPics(diveSiteData);
    }
  };

  useEffect(() => {
    getPhotos(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleSelection = async (species: string) => {
    if (mapRef) {
      const b = await mapRef.getMapBoundaries();
      setMapRegion({
        latitude: (b.northEast.latitude + b.southWest.latitude) / 2,
        longitude: (b.northEast.longitude + b.southWest.longitude) / 2,
        latitudeDelta: Math.abs(b.northEast.latitude - b.southWest.latitude),
        longitudeDelta: Math.abs(b.northEast.longitude - b.southWest.longitude),
      });
    }
    navigation.navigate("SeaLifeScreen", { species });
  };

  const [layoutReady, setLayoutReady] = useState(false);

  return (
    <S.VerticalFlatlistContainer onLayout={() => setLayoutReady(true)}>
      <S.Header>Nearby Sea Life</S.Header>
      <S.SubHeaderRight>
        <S.SwipeIndicator>
          <S.Subtitle>Dive Sites</S.Subtitle>
          <S.IconWrapper>
            <Icon name="double-chevron-right" color={colors.border} />
          </S.IconWrapper>
        </S.SwipeIndicator>
      </S.SubHeaderRight>

      <S.FilterContainer>
        <MobileTextInput
          iconLeft="fish"
          iconRight="close"
          placeholder="Filter Sea Creatures"
          onChangeText={setFilterValue}
          handleClear={() => setFilterValue("")}
          filterValue={filterValue}
        />
      </S.FilterContainer>

      {layoutReady && (
        <FlatList
          data={areaPics}
          keyExtractor={(item, index) => item.id?.toString() || `${item.label}-${index}`}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              name={item.label}
              photoPath={getImagePublicUrl(item, IMAGE_SIZE.LG)}
              onPressHandler={() => handleSelection(item.label)}
              seaLifeSelections={animalMultiSelection}
              subData={`${item.times_seen} Sighting${item.times_seen !== 1 ? "s" : ""}`}
            />
          )}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: moderateScale(30) }} />}
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
                iconLeft="anchor"
                round={false}
                style={{ alignSelf: "center", width: "80%" }}
                onPress={() => scrollToDiveSiteList?.()}
              />
            </S.EmptyStateWrapper>
          )}
        />
      )}
    </S.VerticalFlatlistContainer>
  );
}