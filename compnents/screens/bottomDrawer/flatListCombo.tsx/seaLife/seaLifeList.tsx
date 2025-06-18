import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import Card from '../../card';
import { AreaPicsContext } from '../../../../contexts/areaPicsContext';
import { SearchTextContext } from '../../../../contexts/searchTextContext';
import { getAnimalsInBubble } from '../../../../../supabaseCalls/photoSupabaseCalls';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from "./styles";

const { width } = Dimensions.get('window');

export default function SeaLifeList({ horizontalGestureRef }) {
  const verticalGestureRef = useRef(null);

  const boundaries = useMapStore((state) => state.gpsBubble);
  const { textvalue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const getPhotos = async () => {
    if (boundaries) {
        let diveSiteData = await getAnimalsInBubble(boundaries);
 
        setAreaPics(diveSiteData);
     }
  };

  useEffect(() => {
    getPhotos();
  }, [boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng, textvalue]);

  return (
    <S.VerticalFlatlistContainer>
        <S.Header>Nearby Sea Life</S.Header>
      <NativeViewGestureHandler
        ref={verticalGestureRef}
        simultaneousHandlers={horizontalGestureRef}
      >
        <FlatList
          data={areaPics}
          keyExtractor={(item) => item.id?.toString() || item.photoFile || JSON.stringify(item)}
          renderItem={({ item }) => <Card photo={item} />}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </NativeViewGestureHandler>
    </S.VerticalFlatlistContainer>
  );
}



