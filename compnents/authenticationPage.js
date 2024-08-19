import {
  useWindowDimensions,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import SignInRoute from "./signIn";
import SignUpRoute from "./signUp";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import * as ScreenOrientation from "expo-screen-orientation";
import { scale } from "react-native-size-matters";
import mantaIOS from "../compnents/png/guideIcons/Manta32.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AuthenticationPage() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const FirstRoute = React.memo(() => <SignInRoute />);

  const SecondRoute = () => <SignUpRoute />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Sign In" },
    { key: "second", title: "Sign Up" },
  ]);

  return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ backgroundColor: "#538dbd" , paddingTop: 20}}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: "#538dbd" }}
            indicatorStyle={{ backgroundColor: "lightgrey", height: 1 }}
            activeColor={"lightgrey"}
            inactiveColor={"darkgrey"}
            labelStyle={{
              fontFamily: "SanFranSemi",
              fontSize: windowWidth > 600 ? scale(8) : scale(14),
            }}
          />
        )}
      />
  );
}
