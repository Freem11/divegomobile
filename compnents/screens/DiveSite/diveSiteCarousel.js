import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  View,
} from "react-native";
import carrouselData from './carrouselData.json'
import styles  from "./carouselStyle";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import DiveSite from "../diveSite";

export default function DiveSiteCarousel() {
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(1);

  const moveToTripsPage = () => {
    setCarrouselIndex(3);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToReviewsPage = () => {
    setLoginFail(null);
    setRegFail(null);
    setEmailSent(null);
    setCarrouselIndex(2);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToSeaLifePage = () => {
    setCarrouselIndex(1);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToSitePage = () => {
    setCarrouselIndex(0);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  useEffect(() => {
    carrouselIndex === 0 ? moveToSitePage() : null
    carrouselIndex === 1 ? moveToSeaLifePage() : null
    carrouselIndex === 2 ? moveToReviewsPage() : null
    carrouselIndex === 3 ? moveToTripsPage() : null
  },[carrouselIndex])

  return (
    <View style={styles.wrapper}>
       <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainter}
        ref={carrouselRef}
        horizontal
        pagingEnabled
        onScrollToIndexFailed={(carrouselIndex) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 1));
          wait.then(() => {
            setCarrouselIndex(1);
            const scrollToIndex = carrouselIndex;
            carrouselRef.current?.scrollToIndex(scrollToIndex);
          });
        }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.page}
        data={carrouselData}
        renderItem={({ item }) => (
          <View key={item.page} style={styles.pageContent}>
            {item.page === 1 ? (
          <DiveSite/>
            ) : null}

            {item.page === 2 ? (
              <DiveSite/>
            ) : null}

            {item.page === 3 ? (
              <DiveSite/>
            ) : null}

             {item.page === 4? (
              <DiveSite/>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
