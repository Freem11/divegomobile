import React, { useEffect, useState, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";

import Card from "../../card";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getDiveSitesWithUser } from "../../../../../supabaseCalls/diveSiteSupabaseCalls";
import MobileTextInput from "../../../../reusables/textInput";
import EmptyState from "../../../../reusables/emptyState-new";
import Button from "../../../../reusables/button";
import { useAppNavigation } from "../../../../mapPage/types";
import * as S from "../styles";

export default function DiveSiteList() {
  const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const getDiveSiteData = async (filterValue: string) => {
    if (boundaries) {
      const diveSiteData = await getDiveSitesWithUser({
        minLat: boundaries.minLat,
        maxLat: boundaries.maxLat,
        minLng: boundaries.minLng,
        maxLng: boundaries.maxLng
      }, { label: filterValue });

      setDiveSites(diveSiteData);
    }
  };

  useEffect(() => {
    getDiveSiteData(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleDiveSiteSelection = (siteId: number) => {
    navigation.navigate("DiveSiteNavigator", { id: siteId });
  };

  const handleClear = () => {
    setFilterValue("");
  };

  const handleScreen = () => {
    navigation.navigate("AddSite");
  };

  const [layoutReady, setLayoutReady] = useState(false);

  const renderListHeader = useMemo(() => (
    <S.FilterContainer>
      <MobileTextInput
        iconLeft={"anchor"}
        iconRight={"close"}
        placeholder="Filter Dive Sites"
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
                onPress={() => handleScreen()}
              />
            </S.EmptyStateWrapper>
          )}
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
}