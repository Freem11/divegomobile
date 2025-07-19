import React, { useContext } from "react";

import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";

import ItineraryCardView from "./view";

type ItineraryCardProps = {
  itinerary: ItineraryItem;
  isMyShop?: boolean;
  handleEdit: (sites: ItineraryItem) => void;
  handleDelete: (sites: ItineraryItem) => void;
  handleMapFlip: () => void;
  handleBooking: () => void;
};

export default function ItineraryCard({
  itinerary,
  isMyShop,
  handleEdit,
  handleDelete,
  handleMapFlip,
  handleBooking
}: ItineraryCardProps) {

   return (
    <ItineraryCardView
      itinerary={itinerary}
      isMyShop={isMyShop}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleMapFlip={handleMapFlip}
      handleBooking={handleBooking}
    />
  );
}
