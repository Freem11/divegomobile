import React, { useContext, useEffect, useState } from "react";
import ShopListPageView from "./shopList";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { getShopByUserID } from "../../../supabaseCalls/shopsSupabaseCalls";
import { DiveShop } from "../../../entities/diveShop";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";

export default function ShopListPage() {

  const { profile } = useContext(UserProfileContext);
  const [listOfShops, setListOfShops] = useState<DiveShop[]>([]);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  
  useEffect(() => {
    console.log(profile)
    if (profile) {
      getShops(profile?.UserID);
    }
  }, []);

  const getShops = async (id: string) => {
    try {
      const shops = await getShopByUserID(id);
      if (shops) {
        setListOfShops(shops);
      }
    } catch (e) {
      console.log({ title: 'Error', message: (e as Error).message });
    }
  };

  const handleDiveCenterSelection = (shopId: number) => {
    setActiveScreen("DiveShopScreen", {id: shopId})
    setLevelOneScreen(true)
  }

  return (
    <ShopListPageView
      handleDiveCenterSelection={handleDiveCenterSelection}
      listOfShops={listOfShops}
    />
  )
}