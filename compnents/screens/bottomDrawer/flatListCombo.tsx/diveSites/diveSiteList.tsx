import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler'; // Removed NativeViewGestureHandler
import Card from '../../card';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from './styles';
import { getDiveSitesWithUser } from '../../../../../supabaseCalls/diveSiteSupabaseCalls';
import { useActiveScreenStore } from "../../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../../contexts/levelOneScreenContext";
import MobileTextInput from "../../../../reusables/textInput";

export default function DiveSiteList() {

  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  
  const getDiveSiteData = async (filterValue: string) => {
    if (boundaries) {
       let diveSiteData = await getDiveSitesWithUser({
        minLat: boundaries.minLat,
        maxLat: boundaries.maxLat,
        minLng: boundaries.minLng,
        maxLng: boundaries.maxLng}, { label: filterValue });

      setDiveSites(diveSiteData);
    }
  };

  useEffect(() => {
    getDiveSiteData(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);


  const handleDiveSiteSelection = (siteId: number) => {
    setActiveScreen("DiveSiteScreen", {id: siteId})
    setLevelOneScreen(true)
  }
 
  return (
    <S.VerticalFlatlistContainer>
      <S.Header>Nearby Dive Sites</S.Header>
        <FlatList
          ListHeaderComponent={
          <S.FilterContainer>
          <MobileTextInput 
            iconLeft={'anchor'}
            placeholder="Filter Dive Sites" 
            onChangeText={(text: string) => setFilterValue( text )}
            />
          </S.FilterContainer>
        }
          data={diveSites}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card id={item.id} name={item.name} photoPath={item.divesiteprofilephoto} subData={item.times_seen} onPressHandler={() => handleDiveSiteSelection(item.id)}  />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="always"
        />
    </S.VerticalFlatlistContainer>
  );
}