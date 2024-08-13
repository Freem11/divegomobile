import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Image,
  Text,
} from "react-native";

// import carrouselData from './carrouselData.json'
// import emilio from '../png/EmilioNew.png'

const windowWidth = Dimensions.get("window").width;

export default function OnBoarding2() {
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(0);

  const onHorizontalScroll = (event) => {
    const scrollToIndex = carrouselIndex + 1;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const onPress = () => {
    const scrollToIndex = carrouselIndex + 1;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });

    return (
      <View style={styles.wrapper}>
        {/* <FlatList
          ref={carrouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={windowWidth}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum
          keyExtractor={(item) => item.title}
          data={carrouselData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>

              <Text>{item.content}</Text>

              <Text>{item.buttonOneText}</Text>

              <Image source={emilio}/>
              {item.buttonTwoTExt && <Text>{item.buttonTwoText}</Text>}
            </View>
          )}
        /> */}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#538bdb",
  },
});