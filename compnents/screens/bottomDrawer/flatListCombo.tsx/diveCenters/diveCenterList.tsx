import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import Card from '../../card';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from './styles';
import { getDiveShops } from "../../../../../supabaseCalls/shopsSupabaseCalls";

export default function DiveCenterList({ horizontalGestureRef }) {
  const verticalGestureRef = useRef(null);
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveCenters, setDiveCenters] = useState([]);

  const getDiveCenterData = async () => {
    if (boundaries) {
       let diveCenterData = await getDiveShops(boundaries);

      setDiveCenters(diveCenterData);
    }
  };

  useEffect(() => {
    getDiveCenterData();
  }, [boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

 
  return (
    <S.VerticalFlatlistContainer>
      <S.Header>Nearby Dive Centers</S.Header>
      <NativeViewGestureHandler
        ref={verticalGestureRef}
        simultaneousHandlers={horizontalGestureRef}
      >
        <FlatList
          data={diveCenters}
          keyExtractor={(item) => item.id?.toString() || item.id || JSON.stringify(item)}
          renderItem={({ item }) => <Card photo={item} />}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </NativeViewGestureHandler>
    </S.VerticalFlatlistContainer>
  );
}
