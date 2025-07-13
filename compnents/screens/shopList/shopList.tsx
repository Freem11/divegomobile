import React from "react";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import { FlatList} from "react-native-gesture-handler";
import Card from "../bottomDrawer/card";
import { View } from "react-native";
import { DiveShop } from "../../../entities/diveShop";

type ShopListProps = {
  handleDiveCenterSelection: (shopId: number) => void
  listOfShops: DiveShop[]
};

export default function ShopListPageView({
  handleDiveCenterSelection,
  listOfShops
}: ShopListProps) {

  const { t } = useTranslation();

  console.log(listOfShops)
  
  return (
    <S.ContentContainer>

      <S.Header>{t("DiveCenterList.header")}</S.Header>

      <View style={{ flex: 1, padding: 20, width: '100%' }}>
      <FlatList
          data={listOfShops}
          keyExtractor={(item) =>  item.id.toString()}
          renderItem={({ item }) =>    
          <Card id={item.id} name={item.orgName} photoPath={item.diveShopProfilePhoto} onPressHandler={() => handleDiveCenterSelection(item.id)} />
        }
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="always"
        />
        </View>

     </S.ContentContainer>
  );
}
