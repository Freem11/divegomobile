import React from "react";

import TripCreatorNavigator from "./tripCreatorNavigator";

type TripCreatorRouterProps = {
  id: number;
};

export default function TripCreatorRouter(props: TripCreatorRouterProps) {

  return (
    <TripCreatorNavigator id={props.id} />

  );
}