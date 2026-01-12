import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { cloudflareBucketUrl } from "../../globalVariables";
import { getSpeciesPhotos } from "../../../supabaseCalls/seaLifeMetrics/gets";
import { loadSeaLifeInfo } from "../../../ai-calls/aiCall";

import SeaLifeScreen from ".";

type SeaLifeParallaxProps = {
  species: string;
};

export default function SeaLifeParallax(props: SeaLifeParallaxProps) {
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const diveShopNavigation = useDiveShopNavigation();
  const [selectedSeaLife, setSelectedSeaLife] = useState(null);
  const [seaLifeBlurb, setSeaLifeBlurb] = useState<string | null>(null);

  useEffect(() => {
    getSeaLifeInfo();
    getBlurb();
  }, [props.species]);

  const getBlurb = async () => {
    const blurb = await loadSeaLifeInfo(props.species);
    setSeaLifeBlurb(blurb);
  };

  const getSeaLifeInfo = async () => {
    const seaLifeInfo = await getSpeciesPhotos(props.species);
    setSelectedSeaLife(seaLifeInfo);
  };

  const speciesPhoto = selectedSeaLife && selectedSeaLife[0]?.photoFile;
  const fileName = speciesPhoto ? speciesPhoto.split("/").pop() : null;
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;

  const onClose = async () => {
    diveShopNavigation.goBack();
  };

  console.log("seaLifeBlurb", seaLifeBlurb);
  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={speciesPhoto ? { uri: remoteUri } : noImage}
      onClose={onClose}
    >
      <SeaLifeScreen
        species={props.species}
        selectedSeaLife={selectedSeaLife}
      />
    </ParallaxDrawer>
  );
}