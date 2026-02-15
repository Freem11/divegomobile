import React, { useRef } from "react";
import { Animated, Image, ImageStyle, StyleProp } from "react-native";

import DEFAULT_IMAGE from "../png/NoImage.png";

type FadeInImageProps = {
    photoFile: string;
    style?: StyleProp<ImageStyle>;
};

export default function FadeInImage({ photoFile, style }: FadeInImageProps) {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleImageLoad = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    if (!photoFile) {
        return <Image source={{ uri: Image.resolveAssetSource(DEFAULT_IMAGE).uri }} style={style} />;
    }

    return (
        <Animated.Image
            source={{ uri: photoFile }}
            onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
            style={{ ...style, width: "100%", height: "100%", opacity: fadeAnim as any }}
            defaultSource={DEFAULT_IMAGE}
            onLoad={handleImageLoad}
        />
    );
}