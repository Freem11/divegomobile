import React, { useContext, useEffect } from "react";
import IconWithLabel from "../../reusables/iconWithLabal";
import * as S from './styles';
import { getItineraryDiveSiteByIdArray } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { colors } from "../../styles";
import { ScrollView, View } from "react-native";

export default function SiteList(props) {
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  
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

    return (
      <View style={{width: '100%', marginVertical: '15%'}}>
      <ScrollView style={{width: '100%'}}>
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
      </View>
    )
  };
