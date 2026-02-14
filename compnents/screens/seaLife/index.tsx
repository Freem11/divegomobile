import React, { useEffect, useState } from "react";

import { getSpeciesSiteCount, getSpeciesUserCount } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { SeaLife } from "../../../entities/seaLIfe";
import { useAppNavigation } from "../../mapPage/types";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { Animal } from "../../../entities/photos";
import { Image } from "../../../entities/image";

import SeaLifeScreenView from "./seaLife";

type SeaLifeProps = {
  species: string;
  seaLifePhotos: Animal[]
  selectedSeaLife: SeaLife
};

export type diveSiteStat = {
  site_id: number;
  label: string;
  photo_count: number
  siteName: string,
  imageVariants: Image
};

export type userStat = {
  user_id: string;
  label: string;
  photo_count: number,
  userName: string,
  imageVariants: Image
};

export default function SeaLifeScreen({ species, seaLifePhotos, selectedSeaLife }: SeaLifeProps) {
  const [speciesDiveSiteCount, setSpeciesDiveSiteCount] = useState<diveSiteStat[] | null>(null);
  const [speciesUserCount, setSpeciesUserCount] = useState<userStat[] | null>(null);
  const mainNavigation = useAppNavigation();
  const { userProfile } = useUserProfile();

  useEffect(() => {
    getStats(species);
  }, [species]);

  const getStats = async(speciesName: string) => {
    const speciesDiveSiteCounts = await getSpeciesSiteCount(speciesName, 3);
    setSpeciesDiveSiteCount(speciesDiveSiteCounts);

    const speciesUserCounts = await getSpeciesUserCount(speciesName, 3);
    setSpeciesUserCount(speciesUserCounts);
  };

  const onPressDiveSite = async(id: number) => {
    mainNavigation.navigate("DiveSiteNavigator", { id });
  };

  const onPressUser = (id: string | number) => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    const isDifferentUser = Number(numericId) !== userProfile.id;

    if (!isNaN(numericId) && isDifferentUser) {
      mainNavigation.navigate("UserProfile", { id: numericId });
    }
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