import { StyleSheet, Dimensions, View } from "react-native";
import React, { useContext } from "react";
import DiveSiteButton from "./diveSiteButton";
import SiteSearchButton from "./siteSearchButton";
import GuidesButton from "./guidesButton";
import ItineraryListButton from "./itineraryCreatorButton";
import ProfileButton from "./profileButton";
import CircularButton from '../reusables/circularButton';
import { UserProfileContext } from "../contexts/userProfileContext";

const windowWidth = Dimensions.get("window").width;

export default function FABMenu(props) {
  
  const { toggleDiveSites } = props;

  const { profile } = useContext(UserProfileContext);

  const PARTNER_ACCOUNT_STATUS =
    (profile[0] && profile[0].partnerAccount) || false;

  return (
    <View
      style={styles.container2}
    >
      <ProfileButton />
      <SiteSearchButton />
      <CircularButton
                    buttonAction={toggleDiveSites}
                    icon="anchor"
                  />
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
