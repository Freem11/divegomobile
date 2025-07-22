import React, { useContext, useEffect, useState, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";

import Card from "../../card";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getDiveSitesWithUser } from "../../../../../supabaseCalls/diveSiteSupabaseCalls";
import { useActiveScreenStore } from "../../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../../contexts/levelOneScreenContext";
import MobileTextInput from "../../../../reusables/textInput";
import * as S from "./styles";

export default function DiveSiteList() {
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const getDiveSiteData = async(filterValue: string) => {
    if (boundaries) {
      const diveSiteData = await getDiveSitesWithUser({
        minLat: boundaries.minLat,
        maxLat: boundaries.maxLat,
        minLng: boundaries.minLng,
        maxLng: boundaries.maxLng }, { label: filterValue });

      setDiveSites(diveSiteData);
    }
  };

  useEffect(() => {
    getDiveSiteData(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleDiveSiteSelection = (siteId: number) => {
    setActiveScreen("DiveSiteScreen", { id: siteId });
    setLevelOneScreen(true);
  };

  const handleClear = () => {
    setFilterValue("");
  };

  const [layoutReady, setLayoutReady] = useState(false);

  const renderListHeader = useMemo(() => (
    <S.FilterContainer>
      <MobileTextInput
        iconLeft={"anchor"}
        iconRight={"close"}
        placeholder="Filter Dive Sites"
        onChangeText={(text: string) => setFilterValue( text )}
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
      <S.Header>Nearby Dive Sites</S.Header>
      {renderListHeader}

      {layoutReady ? (
        <FlatList
          data={diveSites}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              name={item.name}
              photoPath={item.divesiteprofilephoto}
              subData={item.times_seen}
              onPressHandler={() => handleDiveSiteSelection(item.id)}
            />
          )}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
}