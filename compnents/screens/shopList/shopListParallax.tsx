import React, { useContext } from "react";

import ShopListPage from ".";

import ParallaxDrawer from "../../reusables/parallaxDrawer";

;
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import Center from "../../png/Beach.jpg";
import { useMapStore } from "../../googleMap/useMapStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";

export default function ShopListParallax() {
  const { t } = useTranslation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const onClose = () => {
    setLevelOneScreen(false);
  };

  const onNavigate = async() => {
    Keyboard.dismiss();
    setMapConfig(3, { pageName: "Diveshop", itemId: 0 });
    setLevelOneScreen(false);
  };

  // const popoverContent = () => {
  //   return (
  //   <>
  //   <IconWithLabel
  //   label={t('TripCreator.cloneButton')}
  //   iconName="vector-arrange-below"
  //   buttonAction={() => cloneButtonPress()}
  //   />
  //   </>
  //   )
  // };

  return (
    <ParallaxDrawer
      headerImage={Center}
      onClose={onClose}
      onMapFlip={onNavigate}
      // popoverContent={popoverContent}
    >
      <ShopListPage/>

    </ParallaxDrawer>
  );
}
