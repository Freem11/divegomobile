import { useContext, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import Geocoder from "react-native-geocoding";

import { getSiteNamesThatFit, getSingleDiveSiteByNameAndRegion } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { useMapStore } from "../googleMap/useMapStore";
import { addIconType, addIndexNumber } from "../helpers/optionHelpers";

const GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
Geocoder.init(GoogleMapsApiKey);

export default function useSearchTool() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const mapRef = useMapStore((state) => state.mapRef);

  const [searchValue, setSearchValue] = useState("");
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const [isClearOn, setIsClearOn] = useState(false);

  const getPlaces = async(text) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();
      return placeInfo?.predictions || [];
    } catch (err) {
      console.error("Google Places API Error:", err);
      return [];
    }
  };

  const handleDataList = async(value: string) => {
    const placesData = await getPlaces(value);
    const diveSiteData = await getSiteNamesThatFit(value);

    const placesArray = placesData.map((place) => place.description);
    const diveSiteArray = diveSiteData?.map((diveSite) => {
      return diveSite.region
        ? `${diveSite.name} ~ ${diveSite.region}`
        : diveSite.name;
    }) || [];

    const megaArray = [
      ...addIconType(placesArray, "compass"),
      ...addIconType([...new Set(diveSiteArray)], "anchor"),
    ];

    setList(addIndexNumber(megaArray));
  };

  const handleChange = (text: string) => {
    if (isClearOn) {
      setIsClearOn(false);
    }
    setSearchValue(text);
    handleDataList(text);
  };

  const handleClear = () => {
    setIsClearOn(true);
    setList([]);
    setTextSource(false);
    setSearchValue("");
    Keyboard.dismiss();
  };

  const handleMapOptionSelected = async(place: string) => {
    try {
      const json = await Geocoder.from(place);
      const location = json.results[0].geometry.location;

      mapRef.animateCamera({
        center: { latitude: location.lat, longitude: location.lng },
        zoom: 12,
      });

      finalizeSelection();
    } catch (err) {
      console.warn("Geocoder error:", err);
    }
  };

  const handleDiveSiteOptionSelected = async(diveSite: string) => {
    if (!diveSite) return;

    const [name, region] = diveSite.split(" ~ ");
    const diveSiteSet = await getSingleDiveSiteByNameAndRegion({ name, region });

    if (diveSiteSet && diveSiteSet[0]) {
      const { lat, lng } = diveSiteSet[0];
      mapRef.animateCamera({
        center: { latitude: lat, longitude: lng },
        zoom: 12,
      });
    }

    finalizeSelection();
  };

  const finalizeSelection = () => {
    setList([]);
    setTextSource(false);
    setSearchValue("");
    Keyboard.dismiss();
    setLevelOneScreen(false);
  };

  useEffect(() => {
    if (searchValue.length === 0 && !isClearOn) {
      setList([]);
    }
  }, [searchValue]);

  return {
    list,
    searchValue,
    setTextSource,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected,
  };
}
