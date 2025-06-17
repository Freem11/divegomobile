// SeaLifeList.tsx

import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import Card from '../card';
import { AreaPicsContext } from '../../../contexts/areaPicsContext';
import { SearchTextContext } from '../../../contexts/searchTextContext';
import { getPhotosforMapArea } from '../../../../supabaseCalls/photoSupabaseCalls';
import { useMapStore } from '../../../googleMap/useMapStore';

const { width } = Dimensions.get('window');

export default function SeaLifeList({ horizontalGestureRef }) {
  const verticalGestureRef = useRef(null);

  const boundaries = useMapStore((state) => state.gpsBubble);
  const { textvalue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const getPhotos = async () => {
    if (boundaries) {
      try {
        let photos = [];

        if (boundaries.minLng > boundaries.maxLng) {
          const AmericanPhotos = await getPhotosforMapArea({
            animal: textvalue,
            minLat: boundaries.minLat,
            maxLat: boundaries.maxLat,
            minLng: -180,
            maxLng: boundaries.maxLng,
          });

          const AsianPhotos = await getPhotosforMapArea({
            animal: textvalue,
            minLat: boundaries.minLat,
            maxLat: boundaries.maxLat,
            minLng: boundaries.minLng,
            maxLng: 180,
          });

          photos = [...AsianPhotos, ...AmericanPhotos];
        } else {
          photos = await getPhotosforMapArea({
            animal: textvalue,
            minLat: boundaries.minLat,
            maxLat: boundaries.maxLat,
            minLng: boundaries.minLng,
            maxLng: boundaries.maxLng,
          });
        }

        setAreaPics(photos)

      } catch (e) {
        console.log({ title: "Error fetching photos", message: e.message });
      }
    }
  };

  useEffect(() => {
    getPhotos();
  }, [boundaries, textvalue]);

  return (
    <View style={{ flex: 1, width: width * 0.9, marginLeft: '5%' }}>
        <Text style={{marginTop: '40%', alignSelf: 'center'}}>Sea  Life</Text>
      <NativeViewGestureHandler
        ref={verticalGestureRef}
        simultaneousHandlers={horizontalGestureRef}
      >
        <FlatList
          data={areaPics}
          keyExtractor={(item) => item.id?.toString() || item.photoFile || JSON.stringify(item)}
          renderItem={({ item }) => <Card photo={item} />}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        />
      </NativeViewGestureHandler>
    </View>
  );
}



