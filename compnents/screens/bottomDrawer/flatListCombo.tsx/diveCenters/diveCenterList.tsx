import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import Card from "../../card";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getDiveShops } from "../../../../../supabaseCalls/shopsSupabaseCalls";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";
import { useAppNavigation } from "../../../../mapPage/types";
import * as S from "../styles";
import Icon from "../../../../../icons/Icon";
import { colors } from "../../../../styles";
import getImagePublicUrl from "../../../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../../../entities/image";

export default function DiveCenterList() {
  const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const [diveCenters, setDiveCenters] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (boundaries) {
      getDiveShops(boundaries, filterValue).then(setDiveCenters);
    }
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng]);

  const handleSelection = async(shopId: number) => {
    if (mapRef) {
      const b = await mapRef.getMapBoundaries();
      setMapRegion({
        latitude: (b.northEast.latitude + b.southWest.latitude) / 2,
        longitude: (b.northEast.longitude + b.southWest.longitude) / 2,
        latitudeDelta: Math.abs(b.northEast.latitude - b.southWest.latitude),
        longitudeDelta: Math.abs(b.northEast.longitude - b.southWest.longitude),
      });
    }
    navigation.navigate("DiveShopNavigator", { id: shopId });
  };

  const [layoutReady, setLayoutReady] = useState(false);

  return (
    <S.VerticalFlatlistContainer onLayout={() => setLayoutReady(true)}>
      <S.Header>Nearby Dive Centers</S.Header>
      <S.SubHeaderLeft>
        <S.SwipeIndicator>
          <S.IconWrapper><Icon name="double-chevron-left" color={colors.border} /></S.IconWrapper>
          <S.Subtitle>Dive Sites</S.Subtitle>
        </S.SwipeIndicator>
      </S.SubHeaderLeft>

      <S.FilterContainer>
        <MobileTextInput
          iconLeft="diving-scuba-flag"
          iconRight="close"
          placeholder="Filter Dive Centers"
          onChangeText={setFilterValue}
          handleClear={() => setFilterValue("")}
          filterValue={filterValue}
        />
      </S.FilterContainer>

      {layoutReady && (
        <FlatList
          data={diveCenters}
          keyExtractor={(item, index) => item.id?.toString() || `shop-${index}`}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              name={item.orgName}
              photoPath={getImagePublicUrl(item.diveShopProfilePhoto, IMAGE_SIZE.LG)}
              onPressHandler={() => handleSelection(item.id)}
            />
          )}
          nestedScrollEnabled
          ListFooterComponent={<View style={{ height: moderateScale(30) }} />}
          ListEmptyComponent={(
            <S.EmptyStateWrapper>
              <EmptyState
                iconName="diving-scuba-flag"
                title="No Nearby Dive Centres!"
                subtitle={"Currently we have no Dive Centres in this area\n\nIf you know of one: contact them and ask them to join Scuba SEAsons!\n\nIf you are affiliated with a Dive Center: Upgrade to a Partner Account!"}
              />
              <Button
                size="thin"
                title={"Upgrade My Account"}
                iconLeft="diving-scuba-flag"
                round={false}
                style={{ alignSelf: "center", width: "90%" }}
                onPress={() => navigation.navigate("Settings")}
              />
            </S.EmptyStateWrapper>
          )}
        />
      )}
    </S.VerticalFlatlistContainer>
  );
}