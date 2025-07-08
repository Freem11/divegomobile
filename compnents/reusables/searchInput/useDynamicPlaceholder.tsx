import { useEffect, useRef, useState, useCallback } from 'react';
import { Animated } from 'react-native';

export const useRotatingPlaceholder = (terms, interval = 2500) => {
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const placeholderOpacity = useRef(new Animated.Value(1)).current;
  const [rotatingWord, setRotatingWord] = useState(terms[0]);

  const animatePlaceholderChange = useCallback(() => {
    const nextIndex = (index + 1) % terms.length;

    Animated.timing(placeholderOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      requestAnimationFrame(() => {
        setIndex(nextIndex);
        setRotatingWord(terms[nextIndex]);

        Animated.timing(placeholderOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [index, placeholderOpacity, terms]);

  useEffect(() => {
    if (isFocused) return;

    const rotationInterval = setInterval(() => {
      animatePlaceholderChange();
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [isFocused, animatePlaceholderChange]);

  return {
    rotatingWord,
    placeholderOpacity,
    setIsFocused,
  };
};

