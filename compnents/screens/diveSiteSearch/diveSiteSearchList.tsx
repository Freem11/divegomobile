import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native";

import { DiveSitesCard } from "../../reusables/addDiveSiteButton";
import { getDiveSitesBasic } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { useDiveSiteNavigation } from "../diveSite/types";
import { useAppNavigation } from "../../mapPage/types";
import ButtonIcon from "../../reusables/buttonIcon";
import { colors } from "../../styles";
import EmptyState from "../../reusables/emptyState-new";

import * as S from "./styles";

export default function DiveSiteSearchList() {
  const diveSiteNavigation = useDiveSiteNavigation();
  const mainNavigation = useAppNavigation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState([]);

  const getSites = async () => {
    const data = await getDiveSitesBasic(boundaries);
    setDiveSites(data);
  };

  const openDiveSite = (id: number) => {
    diveSiteNavigation.navigate("DiveSiteNavigator", { id });
  };

  const handleBack = () => {
    setMapConfig(0);
    mainNavigation.goBack();
  };

  useEffect(() => {
    if (boundaries) {
      getSites();
    }
  }, [boundaries?.maxLat, boundaries?.maxLng]);

  const [layoutReady, setLayoutReady] = useState(false);

  console.log(diveSites);
  return (
    <S.VerticalFlatlistContainer onLayout={() => setLayoutReady(true)}>
      <S.HeaderContainer>
        <S.Header>Find Your Dive Site</S.Header>
        <ButtonIcon
          icon="close"
          onPress={handleBack}
          size="icon"
          fillColor={colors.darkGrey}
        />

      </S.HeaderContainer>

      {layoutReady && (
        <FlatList
          data={diveSites}
          keyExtractor={(item, index) => item.id?.toString() || `site-${index}`}
          renderItem={({ item }) => (
            <DiveSitesCard
              key={item.id}
              diveSiteId={item.id}
              siteNumber={item.siteNumber}
              diveSiteName={item.name}
              onPress={() => openDiveSite(item.id)}
            />
          )}
          nestedScrollEnabled
          ListFooterComponent={<View style={{ height: moderateScale(30) }} />}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={(
            <S.EmptyStateWrapper>
              <EmptyState
                iconName="anchor"
                title="No Nearby Dive Sites!"
                subtitle={"No dive sites found nearby. \nIf you know one, add it!"}
              />
            </S.EmptyStateWrapper>
          )}
        />
      )}
    </S.VerticalFlatlistContainer>
  );
}