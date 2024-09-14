import { StyleSheet, View, Dimensions, FlatList, Text } from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import Picture from "../modals/picture";
import ListItem from "../reusables/listItem";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  buttonText,
} from "../styles";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function BottomDrawer(props) {
  const {
    dataSet,
    dataSetType,
    lowerBound,
    upperBound,
    drawerHeader,
    emptyDrawer,
    headerButton
  } = props;

  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  const photosRef = useRef(null);
  const boxheight = useSharedValue(lowerBound);
  const [bounds, setBounds] = useState({});

  useEffect(() => {
    setBounds({ lower: lowerBound, upper: upperBound });
  }, []);

  const animatedBottomDrawer = Gesture.Pan().onUpdate((event) => {
    if (event.translationY < 0) {
      boxheight.value = bounds.upper;
    } else {
      boxheight.value = bounds.lower;
    }
  });

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(boxheight.value, {
        duration: 400,
        easing: Easing.inOut(Easing.linear),
      }),
    };
  });

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
  };

  console.log(dataSet)
  return (
    <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
      <GestureDetector gesture={animatedBottomDrawer}>
        <View style={styles.handle}>
          <Text style={styles.label}>{drawerHeader}</Text>
          {/* <View style={styles.tab}></View> */}
        </View>
      </GestureDetector>

      {dataSet.length > 0 ? (
        <FlatList
          style={styles.page}
          contentContainerStyle={styles.pageContainer}
          ListHeaderComponent={
            dataSetType === "Trips" ? (
              <View style={styles.flatListHeader}>
                <View style={styles.selectSitesButton}>
            <Text style={styles.selectSitesText}>{headerButton}</Text>
                </View>
              </View>
            ) : null
          }
          ref={photosRef}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={moderateScale(290)}
          snapToAlignment="center"
          decelerationRate="normal"
          keyExtractor={(item) => item.id}
          data={dataSet}
          renderItem={({ item }) => (
            <View>
              {dataSetType === "Trips" ? (
                <ListItem key={item.id} titleText={item}></ListItem>
              ) : null}

              {dataSetType === "DiveSitePhotos" ? (
                <View style={styles.shadowbox}>
                  <Picture key={item.id} pic={item}></Picture>
                </View>
              ) : null}
            </View>
          )}
        />
      ) : (
        <View style={{alignItems: "center"}}>
         {dataSetType === "Trips" ? (
              <View style={styles.flatListHeader}>
                <View style={styles.selectSitesButton}>
            <Text style={styles.selectSitesText}>{headerButton}</Text>
                </View>
              </View>
            ) : null}
          <Text style={styles.noSightings}>{emptyDrawer}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainHousing: {
    position: "absolute",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 20,
    elevation: 10,
    width: windowWidth,
    borderColor: "darkgrey",
    borderWidth: moderateScale(1),
    borderTopRightRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    backgroundColor: colors.themeWhite,
  },
  handle: {
    zIndex: 11,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "darkgrey",
    borderBottomWidth: moderateScale(1),
    height: moderateScale(30),
    width: "100%",
  },
  flatListHeader: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(60),
  },
  selectSitesButton: [
    primaryButton,
    { zIndex: 10 },
  ],
  selectSitesText: [buttonText, { marginHorizontal: moderateScale(5) }],
  tab: {
    backgroundColor: colors.themeBlack,
    height: moderateScale(5),
    width: moderateScale(50),
    borderRadius: moderateScale(10),
  },
  label: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.SmallText),
  },
  shadowbox: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
  noSightings: {
    marginTop: windowWidth > 600 ? "15%" : "25%",
    height: moderateScale(25),
    width: "60%",
    // marginLeft: "20%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    color: colors.themeBlack,
  },
});
