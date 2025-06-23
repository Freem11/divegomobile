import { StyleSheet, Dimensions, View } from "react-native";
import React, { useContext } from "react";
import DiveSiteButton from "./diveSiteButton";
import SiteSearchButton from "./siteSearchButton";
import GuidesButton from "./guidesButton";
import ItineraryListButton from "./itineraryCreatorButton";
import ProfileButton from "./profileButton";
import { UserProfileContext } from "../contexts/userProfileContext";

const windowWidth = Dimensions.get("window").width;

export default function FABMenu() {
  
  const { profile } = useContext(UserProfileContext);

  const PARTNER_ACCOUNT_STATUS =
    (profile && profile.partnerAccount) || false;

  return (
    <View
      style={styles.container2}
    >
      <ProfileButton />
      <SiteSearchButton />
      <DiveSiteButton />
      {PARTNER_ACCOUNT_STATUS ? <ItineraryListButton /> : <GuidesButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 90,
    elevation: 90,
    width: windowWidth,
  },
});
