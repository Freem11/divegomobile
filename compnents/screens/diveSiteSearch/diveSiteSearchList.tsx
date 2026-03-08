import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native";

// import { useAppNavigation } from "../../../../mapPage/types";
import { DiveSitesCard } from "../../reusables/addDiveSiteButton";
import { getDiveSitesBasic } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { EmptyState } from "../comments/styles";

import * as S from "./styles";

export default function DiveSiteSearchList() {
  // const navigation = useAppNavigation();
  const boundaries = useMapStore((state) => state.gpsBubble);
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const [diveSites, setDiveSites] = useState([]);

  const getSites = async () => {
    const data = await getDiveSitesBasic(boundaries);
    setDiveSites(data);
  };

  useEffect(() => {
    if (boundaries) {
      getSites();
    }
  }, [boundaries?.maxLat, boundaries?.maxLng]);

  const [layoutReady, setLayoutReady] = useState(false);

  return (
    <S.VerticalFlatlistContainer onLayout={() => setLayoutReady(true)}>
      <S.Header>Find Your Dive Site</S.Header>

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
              onPress={() => null}
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
            </S.EmptyStateWrapper>
          )}
        />
      )}
    </S.VerticalFlatlistContainer>
  );
}