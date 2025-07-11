import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useRotatingPlaceholder = (terms, interval = 2500) => {
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const placeholderOpacity = useRef(new Animated.Value(1)).current;
  const [rotatingWord, setRotatingWord] = useState(terms[0]);

  useEffect(() => {
    if (isFocused) return;

    const rotationInterval = setInterval(() => {
      animatePlaceholderChange();
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [isFocused, index]);

  const animatePlaceholderChange = () => {
    const nextIndex = (index + 1) % terms.length;

    Animated.timing(placeholderOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIndex(nextIndex);
      setRotatingWord(terms[nextIndex]);

      Animated.timing(placeholderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return {
    rotatingWord,
    placeholderOpacity,
    setIsFocused,
  };
};
