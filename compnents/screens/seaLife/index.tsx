import React, { useEffect, useState } from "react";

import { getSpeciesSiteCount, getSpeciesUserCount } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { DiveSiteWithUserName } from "../../../entities/diveSite";

import SeaLifeScreenView from "./seaLife";

type SeaLifeProps = {
  species: string;
  selectedSeaLife: DiveSiteWithUserName[]
};

export type diveSiteStat = {
  site_id: number;
  label: string;
  photo_count: number
};

export type userStat = {
  user_id: string;
  label: string;
  photo_count: number
};

export default function SeaLifeScreen({ species, selectedSeaLife }: SeaLifeProps) {
  const [speciesDiveSiteCount, setSpeciesDiveSiteCount] = useState<diveSiteStat[] | null>(null);
  const [speciesUserCount, setSpeciesUserCount] = useState<userStat[] | null>(null);

  useEffect(() => {
    getStats(species);
  }, [species]);

  const getStats = async (species) => {
    const speciesDiveSiteCounts = await getSpeciesSiteCount(species);
    setSpeciesDiveSiteCount(speciesDiveSiteCounts);

    const speciesUserCounts = await getSpeciesUserCount(species);
    setSpeciesUserCount(speciesUserCounts);
  };

  return (
    <SeaLifeScreenView
      species={species}
      speciesDiveSiteCount={speciesDiveSiteCount}
      speciesUserCount={speciesUserCount}
      selectedSeaLife={selectedSeaLife}
    />
  );
}