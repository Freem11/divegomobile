import React, { useContext } from "react";
import ImageCasher from "../../../helpers/imageCashing";
import { moderateScale } from "react-native-size-matters";
import * as S from "./styles";
import Histogram from "../flatListCombo.tsx/histogram";
import { AnimalMultiSelectContext } from "../../../contexts/animalMultiSelectContext";
import { TouchableOpacity } from "react-native";

export default function Card(props) {
  const { photo } = props;
  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );

  const handleAnimalSelect = (label: string) => {
    setAnimalMultiSelection((prev) => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const sanitized = {
    name: photo.label || photo.name || photo.orgName,
    photo: photo.photoFile || photo.divesiteprofilephoto || photo.diveShopProfilePhoto || null
  }

  return (
    <TouchableOpacity onPress={() => photo.label  ? handleAnimalSelect(photo.label) : null}>
    <S.ImageHousing>
      <ImageCasher
        photoFile={sanitized.photo}
        id={photo.id}
        style={{
          flex: 1,
          borderBottomRightRadius: moderateScale(14),
          borderBottomLeftRadius: moderateScale(14),
          borderTopRightRadius: moderateScale(14),
          borderTopLeftRadius: moderateScale(14),
          resizeMode: "cover",
        }}
      />
        <S.Overlay pointerEvents="none">
            {animalMultiSelection.includes(photo.label) ? <Histogram animal={photo.label} /> : null}
            <S.SeaLifeName>{sanitized.name}</S.SeaLifeName>
        </S.Overlay>
    </S.ImageHousing>
    </TouchableOpacity>
  );
}
