import React, { useContext } from "react";

import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";

import ItineraryCardView from "./view";

type ItineraryCardProps = {
  itinerary:       ItineraryItem
  isMyShop?:       boolean
  buttonOneAction: () => void
  buttonTwoAction: () => void
};

export default function ItineraryCard({ itinerary, isMyShop, buttonOneAction, buttonTwoAction }: ItineraryCardProps) {
  
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const flipMap = async(siteList: number[]) => {
    setSitesArray(siteList);

    const itinerizedDiveSites = await getDiveSitesByIDs(siteList);

    if (!itinerizedDiveSites || itinerizedDiveSites.length === 0) {
      console.error("No dive sites found or itinerizedDiveSites is undefined.");
      return; // Exit early if itinerizedDiveSites is undefined or empty
    }
  };

  return (
    <ItineraryCardView
      itinerary={itinerary}
      flipMap={() => flipMap(sitesArray)}
      isMyShop={isMyShop}
      buttonOneAction={buttonOneAction}
      buttonTwoAction={buttonTwoAction}
    />
  );
}
