import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native";

import Card from "../../card";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getDiveSitesWithUser } from "../../../../../supabaseCalls/diveSiteSupabaseCalls";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";
import { useAppNavigation } from "../../../../mapPage/types";
import * as S from "../styles";
import Icon from "../../../../../icons/Icon";
import { colors } from "../../../../styles";
import getImagePublicUrl from "../../../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../../../entities/image";

export default function DiveSiteList() {
  const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const [diveSites, setDiveSites] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (boundaries) {
      getDiveSitesWithUser({
        minLat: boundaries.minLat, maxLat: boundaries.maxLat,
        minLng: boundaries.minLng, maxLng: boundaries.maxLng
      }, { label: filterValue }).then(setDiveSites);
    }
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng]);

  const handleSelection = async(siteId: number) => {
    if (mapRef) {
      const b = await mapRef.getMapBoundaries();
      setMapRegion({
        latitude: (b.northEast.latitude + b.southWest.latitude) / 2,
        longitude: (b.northEast.longitude + b.southWest.longitude) / 2,
        latitudeDelta: Math.abs(b.northEast.latitude - b.southWest.latitude),
        longitudeDelta: Math.abs(b.northEast.longitude - b.southWest.longitude),
      });
    }
    navigation.navigate("DiveSiteNavigator", { id: siteId });
  };

  const [layoutReady, setLayoutReady] = useState(false);

  return (
    <S.VerticalFlatlistContainer onLayout={() => setLayoutReady(true)}>
      <S.Header>Nearby Dive Sites</S.Header>
      <S.SubHeaderWrapper>
        <S.SwipeIndicator>
          <S.IconWrapper><Icon name="double-chevron-left" color={colors.border} /></S.IconWrapper>
          <S.Subtitle>Sea Life</S.Subtitle>
        </S.SwipeIndicator>
        <S.SwipeIndicator>
          <S.Subtitle>Dive Centres</S.Subtitle>
          <S.IconWrapper><Icon name="double-chevron-right" color={colors.border} /></S.IconWrapper>
        </S.SwipeIndicator>
      </S.SubHeaderWrapper>

      <S.FilterContainer>
        <MobileTextInput
          iconLeft="anchor"
          iconRight="close"
          placeholder="Filter Dive Sites"
          onChangeText={setFilterValue}
          handleClear={() => setFilterValue("")}
          filterValue={filterValue}
        />
      </S.FilterContainer>

      {layoutReady && (
        <FlatList
          data={diveSites}
          keyExtractor={(item, index) => item.id?.toString() || `site-${index}`}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              name={item.name}
              photoPath={getImagePublicUrl(item.diveSiteProfilePhoto, IMAGE_SIZE.LG)}
              subData={item.times_seen}
              onPressHandler={() => handleSelection(item.id)}
            />
          )}
          nestedScrollEnabled
          ListFooterComponent={<View style={{ height: moderateScale(30) }} />}
          ListEmptyComponent={(
            <S.EmptyStateWrapper>
              <EmptyState
                iconName="anchor"
                title="No Nearby Dive Sites!"
                subtitle={"Currently we have no Dive Sites in this area, if you know of one, please add it via our Dive Site Submission Tool!"}
              />
              <Button
                size="thin"
                title={"Add New Dive Site"}
                iconLeft="anchor"
                round={false}
                style={{ alignSelf: "center", width: "80%" }}
                onPress={() => navigation.navigate("BottomTab", { screen: "AddSite" })}
              />
            </S.EmptyStateWrapper>
          )}
        />
      )}
    </S.VerticalFlatlistContainer>
  );
}