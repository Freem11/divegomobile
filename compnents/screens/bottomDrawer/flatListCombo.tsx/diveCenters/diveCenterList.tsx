import React, { useContext, useEffect, useState, useMemo } from 'react';
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

  const getDiveCenterData = async (filterValue: string) => {
    if (boundaries) {
      let diveCenterData = await getDiveShops(boundaries, filterValue);
      setDiveCenters(diveCenterData);
    }
  };

  useEffect(() => {
    getDiveCenterData(filterValue);
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

  const handleDiveCenterSelection = (shopId: number) => {
    setActiveScreen("DiveShopScreen", {id: shopId})
    setLevelOneScreen(true)
  }

  const handleClear = () => {
    setFilterValue('')
  }

  const [layoutReady, setLayoutReady] = useState(false);

  const renderListHeader = useMemo(() => (
    <S.FilterContainer>
      <MobileTextInput
        iconLeft={'diving-scuba-flag'}
        iconRight={'close'}
        placeholder="Filter Dive Centers"
        onChangeText={(text: string) => setFilterValue( text )}
        handleClear={() => handleClear()}
        filterValue={filterValue}
      />
    </S.FilterContainer>
  ), [filterValue, handleClear, setFilterValue]);

  return (
    <S.VerticalFlatlistContainer
    onLayout={() => {
      if (!layoutReady) setLayoutReady(true);
    }}
    >
      <S.Header>Nearby Dive Centers</S.Header>
      {renderListHeader}

      {layoutReady ? (
        <FlatList
          data={diveCenters}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card id={item.id} name={item.orgName} photoPath={item.diveShopProfilePhoto} onPressHandler={() => handleDiveCenterSelection(item.id)} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        />
      ) : null}
    </S.VerticalFlatlistContainer>
  );
}