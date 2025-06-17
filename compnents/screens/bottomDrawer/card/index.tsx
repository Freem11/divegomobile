import React from "react";
import { View } from "react-native";
import ImageCasher from "../../../helpers/imageCashing";
import { moderateScale } from "react-native-size-matters";

export default function Card(props) {
  const { photo } = props;

  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
        height: moderateScale(200),
        width: '98%',
        alignSelf: 'center',
      }}
    >
      <ImageCasher
        photoFile={photo.photoFile}
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
    </View>
  );
}
