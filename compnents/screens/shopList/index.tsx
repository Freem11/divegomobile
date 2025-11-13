import React, { useEffect, useState } from "react";

import { getShopByUserID } from "../../../supabaseCalls/shopsSupabaseCalls";
import { DiveShop } from "../../../entities/diveShop";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { useAppNavigation } from "../../mapPage/types";

import ShopListPageView from "./shopList";

export default function ShopListPage() {
  const appNavigation = useAppNavigation();
  const { userProfile } = useUserProfile();
  const [listOfShops, setListOfShops] = useState<DiveShop[]>([]);

  useEffect(() => {
    console.log(userProfile);
    if (userProfile) {
      getShops(userProfile.UserID);
    }
  }, []);

  const getShops = async (id: string) => {
    try {
      const shops = await getShopByUserID(id);
      if (shops) {
        setListOfShops(shops);
      }
    } catch (e) {
      console.log({ title: "Error", message: (e as Error).message });
    }
  };

  const handleDiveCenterSelection = (shopId: number) => {
    appNavigation.navigate("DiveShopNavigator", { id: shopId });
  };

  return (
    <ShopListPageView
      handleDiveCenterSelection={handleDiveCenterSelection}
      listOfShops={listOfShops}
    />
  );
}