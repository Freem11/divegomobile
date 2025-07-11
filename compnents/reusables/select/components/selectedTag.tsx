import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes } from "../../../styles";

import * as S from "./styles";

type SelectedTagProps = {
  deselctItem: () => void;
  label: string;
};

export default function SelectedTag({ deselctItem, label }: SelectedTagProps) {
  return (
    <S.Tag>
      <S.Label>{label}</S.Label>
      <S.RemoveButton
        onPress={deselctItem}
        accessibilityLabel={`Remove ${label}`}
      >
        <S.RemoveText>✕</S.RemoveText>
      </S.RemoveButton>
    </S.Tag>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonPressOverlay,
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(4),
    marginBottom: moderateScale(4),
    borderRadius: moderateScale(16),
  },
  label: {
    marginHorizontal: moderateScale(4),
    fontSize: moderateScale(fontSizes.SmallText),
  },
  removeButton: {
    padding: moderateScale(2),
  },
  removeText: {
    fontSize: moderateScale(fontSizes.SmallText),
    color: "#888",
  },
});
