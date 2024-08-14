import React, { useRef, useState, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Image,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import carrouselData from "./carrouselData";
import emilio from "../png/EmilioNew.png";
import { registerForPushNotificationsAsync } from "./notificationsRegistery";
import { SessionContext } from "../contexts/sessionContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function OnboardingTest() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(0);
  const { activeSession } = useContext(SessionContext);

  const onPress = () => {
    if (carrouselIndex === 4) {
      registerForPushNotificationsAsync(activeSession);
    }
    moveToNextPage();
  };

  const moveToNextPage = () => {
    if (carrouselIndex + 1 > carrouselData.length) {
      setFullScreenModal(false);
    } else {
      setCarrouselIndex(carrouselIndex + 1);
      const scrollToIndex = carrouselIndex;
      carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainter}
        ref={carrouselRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.page}
        data={carrouselData}
        renderItem={({ item }) => (
          <View key={item.page} style={styles.pageContent}>
            <Text style={styles.title}>{item.title}</Text>

            {item.page === 1 ? (
              <View style={styles.scrollViewBox}>
                <ScrollView style={styles.scrollView}>
                  <Text style={styles.content}>{item.content}</Text>
                </ScrollView>
              </View>
            ) : (
              <Text style={styles.content}>{item.content}</Text>
            )}

            <Image style={styles.image} source={emilio} />

            <View style={styles.buttonBox}>
              <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.buttonOne}>
                  <Text style={styles.buttonOneText}>{item.buttonOneText}</Text>
                </View>
              </TouchableWithoutFeedback>

              {item.buttonTwoText && (
                <TouchableWithoutFeedback onPress={moveToNextPage}>
                  <View style={styles.buttonTwo}>
                    <Text style={styles.buttonTwoText}>
                      {item.buttonTwoText}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "#0073E6",
    zIndex: 26,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "100%",
    height: windowHeight / 2,
    marginTop: "10%",
    marginBottom: "2%",
    // backgroundColor: "lightblue",
  },
  pageContainter: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    // backgroundColor: "green",
    height: windowHeight,
    width: windowWidth,
    alignItems: "center",
    // borderColor: "grey",
    // borderWidth: 2,
  },
  scrollViewBox: {
    height: windowHeight / 3.1,
    // backgroundColor: 'pink'
  },
  scrollView: {
    // backgroundColor: 'purple',
  },
  title: {
    fontFamily: "GothamBlack",
    fontSize: moderateScale(32),
    marginTop: moderateScale(50),
    marginBottom: moderateScale(10),
    width: windowWidth,
    color: "#F0EEEB",
    textAlign: "center",
  },
  content: {
    paddingTop: moderateScale(5),
    fontFamily: "SanFran",
    fontSize: moderateScale(16),
    marginTop: moderateScale(15),
    width: windowWidth * 0.8,
    color: "#F0EEEB",
    textAlign: "center",
  },
  image: {
    position: "absolute",
    bottom: moderateScale(95),
    right: moderateScale(-50),
    height: moderateScale(200),
    width: moderateScale(300),
    transform: [{ rotate: "3deg" }],
  },
  buttonBox: {
    // backgroundColor: 'pink',
    width: windowWidth * 0.85,
    height: moderateScale(70),
    position: "absolute",
    bottom: scale(20),
    borderTopWidth: moderateScale(1),
    borderTopColor: "lightgray",
    paddingTop: moderateScale(5),
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonTwo: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: "white",
  },
  buttonTwoText: {
    fontFamily: "GothamBold",
    fontSize: moderateScale(20),
    color: "white",
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  buttonOne: {
    borderRadius: moderateScale(10),
    backgroundColor: "white",
  },
  buttonOneText: {
    fontFamily: "GothamBold",
    fontSize: moderateScale(20),
    color: "#538bdb",
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
});
