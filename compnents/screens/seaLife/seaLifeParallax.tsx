import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { cloudflareBucketUrl } from "../../globalVariables";
import { getSpeciesData, getSpeciesPhotos } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { loadSeaLifeInfo } from "../../../ai-calls/aiCall";
import { updateSpeciesFact } from "../../../supabaseCalls/seaLifeMetrics/updates";
import { SeaLife } from "../../../entities/seaLIfe";

import SeaLifeScreen from ".";

type SeaLifeParallaxProps = {
  species: string;
};

export default function SeaLifeParallax(props: SeaLifeParallaxProps) {
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const diveShopNavigation = useDiveShopNavigation();
  const [selectedSeaLife, setSelectedSeaLife] = useState<SeaLife | null>(null);
  const [seaLifePhotos, setSeaLifePhotos] = useState(null);

  useEffect(() => {
    getSeaLifeInfo(props.species);
  }, [props.species]);

  const getSeaLifeInfo = async (label: string) => {
    const speciesExists = await getSpeciesData(label);
    if (speciesExists && !speciesExists.description) {
      console.log("No description found, calling Gemini...");
      getBlurb();
    } else {
      setSelectedSeaLife(speciesExists);
    }

    const seaLifeInfo = await getSpeciesPhotos(label);
    setSeaLifePhotos(seaLifeInfo);

  };

  const getBlurb = async () => {
    const blurb = await loadSeaLifeInfo(props.species);
    const updatedSeaLife = await updateSpeciesFact(props.species, blurb);
    setSelectedSeaLife(updatedSeaLife);
  };

  const speciesPhoto = seaLifePhotos && seaLifePhotos[0]?.photoFile;
  const fileName = speciesPhoto ? speciesPhoto.split("/").pop() : null;
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;

  const onClose = async () => {
    diveShopNavigation.goBack();
  };

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={speciesPhoto ? { uri: remoteUri } : noImage}
      onClose={onClose}
    >
      <SeaLifeScreen
        species={props.species}
        seaLifePhotos={seaLifePhotos}
        selectedSeaLife={selectedSeaLife}
      />
    </ParallaxDrawer>
  );
}