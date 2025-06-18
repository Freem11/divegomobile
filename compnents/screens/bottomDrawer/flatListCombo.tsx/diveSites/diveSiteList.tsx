import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import Card from '../../card';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from './styles';
import { getDiveSitesWithUser } from '../../../../../supabaseCalls/diveSiteSupabaseCalls';

export default function DiveSiteList({ horizontalGestureRef }) {
  const verticalGestureRef = useRef(null);
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState([]);

  const getDiveSiteData = async () => {
    if (boundaries) {
       let diveSiteData = await getDiveSitesWithUser({
        minLat: boundaries.minLat,
        maxLat: boundaries.maxLat,
        minLng: boundaries.minLng,
        maxLng: boundaries.maxLng});

      setDiveSites(diveSiteData);
    }
  };

  useEffect(() => {
    getDiveSiteData();
  }, [boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng]);

 
  return (
    <S.VerticalFlatlistContainer>
      <S.Header>Nearby Dive Sites</S.Header>
      <NativeViewGestureHandler
        ref={verticalGestureRef}
        simultaneousHandlers={horizontalGestureRef}
      >
        <FlatList
          data={diveSites}
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
