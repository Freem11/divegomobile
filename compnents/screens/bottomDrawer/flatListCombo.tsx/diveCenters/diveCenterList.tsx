import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Card from '../../card';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from './styles';
import { getDiveShops } from "../../../../../supabaseCalls/shopsSupabaseCalls";
import { useActiveScreenStore } from "../../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../../contexts/levelOneScreenContext";
import MobileTextInput from "../../../../reusables/textInput";

export default function DiveCenterList() {
  
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveCenters, setDiveCenters] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  
  const getDiveCenterData = async () => {
    if (boundaries) {
       let diveCenterData = await getDiveShops(boundaries);

      setDiveCenters(diveCenterData);
    }
  };

  useEffect(() => {
    console.log('filterValue', filterValue)
    getDiveCenterData();
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleDiveCenterSelection = (shopId: number) => {
    setActiveScreen("DiveShopScreen", {id: shopId})
    setLevelOneScreen(true)
  }
  
  return (
    <S.VerticalFlatlistContainer>
      <S.Header>Nearby Dive Centers</S.Header>
        <FlatList
          ListHeaderComponent={
          <S.FilterContainer>
          <MobileTextInput 
            iconLeft={'diving-scuba-flag'}
            placeholder="Filter Dive Centers" 
            onChangeText={(text: string) => setFilterValue( text )}
            />
          </S.FilterContainer>
        }
          data={diveCenters}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card id={item.id} name={item.orgName} photoPath={item.diveShopProfilePhoto} onPressHandler={() => handleDiveCenterSelection(item.id)} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="always"
        />
    </S.VerticalFlatlistContainer>
  );
}