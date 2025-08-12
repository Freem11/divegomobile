import React, { useContext, useEffect, useState, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";

import Card from "../../card";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getDiveShops } from "../../../../../supabaseCalls/shopsSupabaseCalls";
import { useActiveScreenStore } from "../../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../../contexts/levelOneScreenContext";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";

import * as S from "./styles";

export default function DiveCenterList() {

  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveCenters, setDiveCenters] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

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
    setActiveScreen("DiveShopScreen", { id: shopId });
    setLevelOneScreen(true);
  };

  const handleClear = () => {
    setFilterValue("");
  };

  const handleScreen = () => {
    setLevelOneScreen(true);
    setActiveScreen("SettingsScreen");
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
      {renderListHeader}

      {layoutReady ? (
        <FlatList
          data={diveCenters}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card id={item.id} name={item.orgName} photoPath={item.diveShopProfilePhoto} onPressHandler={() => handleDiveCenterSelection(item.id)} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
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
                style={{ marginLeft: "10%", width: "80%" }}
                onPress={() => handleScreen()}
              />
            </S.EmptyStateWrapper>
          )}
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
}