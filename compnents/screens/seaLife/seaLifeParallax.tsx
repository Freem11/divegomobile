import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { getSingleSpecies, getSpeciesPhotos } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { loadSeaLifeInfo } from "../../../ai-calls/aiCall";
import { updateSpeciesFact } from "../../../supabaseCalls/seaLifeMetrics/updates";
import { SeaLife } from "../../../entities/seaLIfe";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../entities/image";

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

  const getSeaLifeInfo = async(label: string) => {
    const speciesExists = await getSingleSpecies(label);
    if (speciesExists && !speciesExists.description) {
      console.log("No description found, calling Gemini...");
      getBlurb();
    } else {
      setSelectedSeaLife(speciesExists);
    }

    const seaLifeInfo = await getSpeciesPhotos(label);
    setSeaLifePhotos(seaLifeInfo);

  };

  const getBlurb = async() => {
    const blurb = await loadSeaLifeInfo(props.species);
    const updatedSeaLife = await updateSpeciesFact(props.species, blurb);
    setSelectedSeaLife(updatedSeaLife);
  };

  let remoteUri: string;
  if (selectedSeaLife?.speciesPhoto?.public_domain) {
    remoteUri = getImagePublicUrl(selectedSeaLife?.speciesPhoto, IMAGE_SIZE.LG);
  } else {
    remoteUri = seaLifePhotos && getImagePublicUrl(seaLifePhotos[0]?.image, IMAGE_SIZE.LG);
  }

  const onClose = async() => {
    diveShopNavigation.goBack();
  };

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={remoteUri ? { uri: remoteUri } : noImage}
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