import React, { useEffect, useState, useMemo } from "react";
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
import { colors } from "../../../../styles";
import Icon from "../../../../../icons/Icon";

export default function DiveCenterList() {
  const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveCenters, setDiveCenters] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const getDiveCenterData = async (filterValue: string) => {
    if (boundaries) {
      const diveCenterData = await getDiveShops(boundaries, filterValue);
      setDiveCenters(diveCenterData);
    }
  };

  useEffect(() => {
    getDiveCenterData(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleDiveCenterSelection = (shopId: number) => {
    navigation.navigate("DiveShopNavigator", { id: shopId });
  };

  const handleClear = () => {
    setFilterValue("");
  };

  const handleScreen = () => {
    navigation.navigate("Settings");
  };

  const [layoutReady, setLayoutReady] = useState(false);

  const renderListHeader = useMemo(() => (
    <S.FilterContainer>
      <MobileTextInput
        iconLeft={"diving-scuba-flag"}
        iconRight={"close"}
        placeholder="Filter Dive Centers"
        onChangeText={(text: string) => setFilterValue(text)}
        handleClear={() => handleClear()}
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
      <S.Header>Nearby Dive Centers</S.Header>
      <S.SubHeaderLeft>
        <S.SwipeIndicator>
          <S.IconWrapper>
            <Icon name="double-chevron-left" color={colors.border} />
          </S.IconWrapper>
          <S.Subtitle>Dive Sites</S.Subtitle>
        </S.SwipeIndicator>
      </S.SubHeaderLeft>
      {renderListHeader}

      {layoutReady ? (
        <FlatList
          data={diveCenters}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card id={item.id} name={item.orgName} photoPath={{ "public_domain": item.public_domain, "sm": item.sm, "md": item.md, "lg": item.ldg, "xl": item.xl }} onPressHandler={() => handleDiveCenterSelection(item.id)} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          ListFooterComponent={<View style={{ height: moderateScale(30) }}></View>}
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
                onPress={() => handleScreen()}
              />
            </S.EmptyStateWrapper>
          )}
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
}