import React from "react";

import DiveSiteNavigator from "./diveSiteNavigator";

type DiveSiteRouterProps = {
  id: number;
};

export default function DiveSiteRouter(props: DiveSiteRouterProps) {

  return (
    <DiveSiteNavigator id={props.id} />

  );
}