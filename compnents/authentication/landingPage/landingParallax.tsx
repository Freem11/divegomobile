import React, {useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import blackManta from '../../png/blackManta.png';
import mantaPair from '../../png/mantaPair.jpg';
import { useTranslation } from "react-i18next";
import LandingPage from ".";


export default function LandingParallax(props) {
  const { moveToLoginPage, moveToSignUpPage } = props;
  const { t } = useTranslation();

  const onClose = async () => {
  };

  return (
    <ParallaxDrawer 
      headerImage={mantaPair} 
      >

      <LandingPage moveToLoginPage={moveToLoginPage} moveToSignUpPage={moveToSignUpPage}/>
    </ParallaxDrawer>
  );
}
