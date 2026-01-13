import React, { useEffect, useState } from "react";

import { getSpeciesSiteCount, getSpeciesUserCount } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { SeaLife } from "../../../entities/seaLIfe";
import { useDiveSiteNavigation } from "../diveSite/types";
import { useAppNavigation } from "../../mapPage/types";

import SeaLifeScreenView from "./seaLife";

type SeaLifeProps = {
  species: string;
  seaLifePhotos: DiveSiteWithUserName[]
  selectedSeaLife: SeaLife
};

export type diveSiteStat = {
  site_id: number;
  label: string;
  photo_count: number
  siteName: string,
  sitePhoto: string
};

export type userStat = {
  user_id: string;
  label: string;
  photo_count: number,
  userName: string,
  profilePhoto: string
};

export default function SeaLifeScreen({ species, seaLifePhotos, selectedSeaLife }: SeaLifeProps) {
  const [speciesDiveSiteCount, setSpeciesDiveSiteCount] = useState<diveSiteStat[] | null>(null);
  const [speciesUserCount, setSpeciesUserCount] = useState<userStat[] | null>(null);
  const diveSiteNavigation = useDiveSiteNavigation();
  const mainNavigation = useAppNavigation();

  useEffect(() => {
    getStats(species);
  }, [species]);

  const getStats = async (species) => {
    const speciesDiveSiteCounts = await getSpeciesSiteCount(species, 3);
    setSpeciesDiveSiteCount(speciesDiveSiteCounts);

    const speciesUserCounts = await getSpeciesUserCount(species, 3);
    setSpeciesUserCount(speciesUserCounts);
  };

  const onPressDiveSite = async (id: number) => {
    mainNavigation.navigate("DiveSiteNavigator", { id });
  };

  const onPressUser = async (id: number) => {
    mainNavigation.navigate("BottomTab", {
      screen: "Profile",
      params: { id },
    });
  };

  return (
    <SeaLifeScreenView
      species={species}
      speciesDiveSiteCount={speciesDiveSiteCount}
      speciesUserCount={speciesUserCount}
      seaLifePhotos={seaLifePhotos}
      selectedSeaLife={selectedSeaLife}
      onPressDiveSite={onPressDiveSite}
      onPressUser={onPressUser}
    />
  );
}