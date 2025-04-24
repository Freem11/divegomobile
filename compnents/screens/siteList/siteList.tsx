import React, { useContext, useEffect } from "react";
import IconWithLabel from "../../reusables/iconWithLabal";
import * as S from './styles';
import { getItineraryDiveSiteByIdArray } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { colors } from "../../styles";
import { Keyboard, ScrollView } from "react-native";
import Icon from "../../../icons/Icon";

export default function SiteList() {
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  useEffect(() => {
    getTripDiveSites(sitesArray);
  }, []);

  const getTripDiveSites = async (siteIds) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };
  
  const removeFromSitesArray = async (siteIdNo) => {
    const index = sitesArray.indexOf(siteIdNo);
    if (index > -1) {
      sitesArray.splice(index, 1);
    }
    setSitesArray(sitesArray);
    getTripDiveSites(setSitesArray);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
  };

    return (
      <S.ScrollViewContainer>
      <ScrollView>
      {Array.isArray(tripDiveSites) && tripDiveSites.map((tripDetails, index) => {
        return (
        <S.ListItemContainer key={tripDetails.id}>
        <S.ItemHousing>
        <IconWithLabel  label={tripDetails.name} iconName="anchor" fillColor="white" bgColor={colors.primaryBlue} buttonAction={() => removeFromSitesArray(tripDetails.id)}  />
        </S.ItemHousing>
            {index < tripDiveSites.length - 1 && <S.VerticalLine />}
        </S.ListItemContainer>
      )
      })}
      </ScrollView>
      <S.StyledTouchableHighlight onPress={onNavigate} underlayColor={colors.buttonPressOverlay}>
      <S.ButtonHousing>
         <S.IconWrapperLeft>
         <Icon name={'plus'} fill={colors.primaryBlue} />
         </S.IconWrapperLeft>
           <S.StyledButtonText>Dive Sites</S.StyledButtonText>
      </S.ButtonHousing>
      </S.StyledTouchableHighlight>
      </S.ScrollViewContainer>
    )
  };


