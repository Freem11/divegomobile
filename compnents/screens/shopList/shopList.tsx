import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";

import Card from "../bottomDrawer/card";
import { DiveShop } from "../../../entities/diveShop";

import * as S from "./styles";

type ShopListProps = {
  handleDiveCenterSelection: (shopId: number) => void
  listOfShops: DiveShop[]
};

export default function ShopListPageView({
  handleDiveCenterSelection,
  listOfShops
}: ShopListProps) {

  const { t } = useTranslation();

  return (
    <S.ContentContainer>

      <S.Header>{t("DiveCenterList.header")}</S.Header>

      <View style={{ flex: 1, padding: 20, width: "100%" }}>
        <FlatList
          data={listOfShops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            <Card id={item.id} name={item.orgName} photoPath={item.diveShopProfilePhoto} onPressHandler={() => handleDiveCenterSelection(item.id)} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        />
      </View>

    </S.ContentContainer>
  );
}
