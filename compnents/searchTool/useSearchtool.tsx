import { useContext, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import Geocoder from "react-native-geocoding";
import { getSiteNamesThatFit, getSingleDiveSiteByNameAndRegion } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { useMapStore } from "../googleMap/useMapStore";
import { addIconType, addIndexNumber } from "../helpers/optionHelpers";
import { getCoordsForSeaLife, getSeaCreatures } from "../../supabaseCalls/photoSupabaseCalls";
import { s } from "react-native-size-matters";

const GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
Geocoder.init(GoogleMapsApiKey);

export default function useSearchTool() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const mapRef = useMapStore((state) => state.mapRef);

  const [searchValue, setSearchValue] = useState("");
  const [previousSearchValue, setPreviousSearchValue] = useState("");

  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const [isClearOn, setIsClearOn] = useState(false);

  const getPlaces = async (text: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();

      const filtered = (placeInfo?.predictions || []).filter((prediction) => {
        const poiTypes = ['establishment', 'point_of_interest', 'tourist_attraction', 'premise'];
        return !prediction.types.some(type => poiTypes.includes(type));
      });

      // return filtered;
      return filtered.slice(0, 4);
    } catch (err) {
      console.error("Google Places API Error:", err);
      return [];
    }
  };

  const handleDataList = async (value: string) => {
    const placesData = await getPlaces(value);
    const diveSiteData = await getSiteNamesThatFit(value);
    const seacreatureData = await getSeaCreatures(value, 4);

    const placesArray = placesData.map((place) => place.description);
    const diveSiteArray = diveSiteData?.map((diveSite) => {
      return diveSite.region
        ? `${diveSite.name} ~ ${diveSite.region}`
        : diveSite.name;
    }) || [];
    const seaLifeArray = seacreatureData.map((place) => place.label);

    const megaArray = [
      ...addIconType(placesArray, "compass"),
      ...addIconType([...new Set(diveSiteArray)], "anchor"),
      ...addIconType([...new Set(seaLifeArray)], "shark"),
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

  const handleMapOptionSelected = async (place: string) => {
    try {
      const json = await Geocoder.from(place);
      const location = json.results[0].geometry.location;

      mapRef.animateCamera({
        center: { latitude: location.lat, longitude: location.lng },
        zoom: 12,
      });

      finalizeSelection(place);
    } catch (err) {
      console.warn("Geocoder error:", err);
    }
  };

  const handleDiveSiteOptionSelected = async (diveSite: string) => {
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
    finalizeSelection(diveSite);
  };

  const handleSeaLifeOptionSelected = async (seaCreature: string) => {
    try {
      const seaLifeSet = await getCoordsForSeaLife(seaCreature);

      const coordinates = seaLifeSet.map(site => ({
        latitude: site.latitude,
        longitude: site.longitude,
      }));
      
      mapRef?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      finalizeSelection(seaCreature);
    } catch (err) {
      console.warn("Geocoder error:", err);
    }
  };

  const finalizeSelection = (selection: string) => {
    setList([]);
    setTextSource(false);
    setPreviousSearchValue(selection);
    setSearchValue(selection);
    Keyboard.dismiss();
    setLevelOneScreen(false);
  };

  useEffect(() => {
    if (searchValue.length === 0 && !isClearOn) {
      setList([]);
    }
  }, [searchValue]);

  const handleFocus = () => {
    setPreviousSearchValue(searchValue);
    setSearchValue("");
    setList([]);
  };

  const handleCancelSearch = () => {
    setSearchValue(previousSearchValue);
    setList([]);
    Keyboard.dismiss();
  };

  return {
    list,
    searchValue,
    setTextSource,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected,
    handleSeaLifeOptionSelected,
    handleFocus,
    handleCancelSearch
  };
}
