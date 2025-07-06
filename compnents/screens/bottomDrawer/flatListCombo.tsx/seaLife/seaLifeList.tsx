import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Card from '../../card';
import { AreaPicsContext } from '../../../../contexts/areaPicsContext';
import { SearchTextContext } from '../../../../contexts/searchTextContext';
import { getAnimalsInBubble } from '../../../../../supabaseCalls/photoSupabaseCalls';
import { useMapStore } from '../../../../googleMap/useMapStore';
import * as S from "./styles";
import { AnimalMultiSelectContext } from "../../../../contexts/animalMultiSelectContext";
import MobileTextInput from "../../../../reusables/textInput";

export default function SeaLifeList() {

  const boundaries = useMapStore((state) => state.gpsBubble);
  const { textvalue } = useContext(SearchTextContext);
  const [filterValue, setFilterValue] = useState('');
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
  const getPhotos = async () => {
    if (boundaries) {
        let diveSiteData = await getAnimalsInBubble(boundaries);
 
        setAreaPics(diveSiteData);
     }
  };

  useEffect(() => {
    console.log('filterValue', filterValue)
    getPhotos();
  }, [filterValue, boundaries?.maxLat, boundaries?.maxLng, boundaries?.minLat, boundaries?.minLng, textvalue]);


  const handleAnimalSelect = (label: string) => {
    setAnimalMultiSelection((prev) => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  return (
    <S.VerticalFlatlistContainer>
        <S.Header>Nearby Sea Life</S.Header>
        <FlatList
            ListHeaderComponent={
            <S.FilterContainer>
            <MobileTextInput 
              iconLeft={'shark'}
              placeholder="Filter Sea Creatures" 
              onChangeText={(text: string) => setFilterValue( text )}
              />
            </S.FilterContainer>
          }
          data={areaPics}
          keyExtractor={(item) => item.id?.toString() || item.photoFile || JSON.stringify(item)}
          renderItem={({ item }) => 
            <Card 
            id={item.id} 
            name={item.label} 
            photoPath={item.photofile} 
            onPressHandler={() => handleAnimalSelect(item.label)} 
            seaLifeSelections={animalMultiSelection} 
            subData={`${item.times_seen}  Sighting${item.times_seen !== 1 ? 's' : ''}`}
            />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="always"
        />
    </S.VerticalFlatlistContainer>
  );
}