import React from "react";

import DiveShopNavigator from "./diveShopNavigator";

type DiveSiteRouterProps = {
  id: number;
};

export default function DiveShopRouter(props: DiveSiteRouterProps) {

  return (
    <DiveShopNavigator id={props.id} />

  );
}