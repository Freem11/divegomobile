import React, { useContext, useEffect, useState, memo } from "react";
import { Marker } from "react-native-maps";
import { moderateScale } from "react-native-size-matters";

import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";
import { useAppNavigation } from "../../../mapPage/types";
import { MapConfigurations } from "../../types";
import { Coordinates } from "../../../entities/coordinates";

import * as S from "./styles";

const ANCHOR_WHITE = require("../../../png/mapIcons/AnchorWhite.png");
const ANCHOR_GOLD = require("../../../png/mapIcons/AnchorGold.png");

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
  isSelected: boolean;
  siteNumber?: number;
};

const MarkerDiveSite = memo((props: MarkerDiveSiteProps) => {
  const navigation = useAppNavigation();
  const mapConfig = useMapStore((state) => state.mapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);

  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const isNumberMode = mapConfig === 4;

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500); // 500ms is standard for native image swap
    return () => clearTimeout(timer);
  }, [props.isSelected, mapConfig]);

  function handlePress(e: any) {
    if (e && e.stopPropagation) e.stopPropagation();

    if (mapConfig === MapConfigurations.TripBuild) {
      if (props.isSelected) {
        setSitesArray((prev: any[]) => prev.filter(item =>
          (typeof item === "object" ? item.id !== props.id : item !== props.id)
        ));
      } else {
        setSitesArray((prev: any[]) => [...prev, props.id]);
      }
    } else {
      navigation.navigate("DiveSiteNavigator", { id: props.id });
    }
  }

  return (
    <Marker
      coordinate={props.coordinate}
      onPress={handlePress}
      image={isNumberMode ? null : (props.isSelected ? ANCHOR_GOLD : ANCHOR_WHITE)}
      tracksViewChanges={isNumberMode ? true : tracksViewChanges}
      stopPropagation={true}
      zIndex={props.isSelected ? 999 : 100}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      {isNumberMode && (
        <S.SiteNumber
          style={{
            width: moderateScale(30),
            height: moderateScale(30),
            borderRadius: moderateScale(15)
          }}
        >
          <S.SiteLabel>{props.siteNumber}</S.SiteLabel>
        </S.SiteNumber>
      )}
    </Marker>
  );
});

export default MarkerDiveSite;