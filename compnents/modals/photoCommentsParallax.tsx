import React, { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

import noImage from "../png/NoImage.png";
import ParallaxDrawer from "../reusables/parallaxDrawer";
import { useAppNavigation } from "../mapPage/types";

import { getPhotoByID } from "../../supabaseCalls/seaLifePhotoCalls/gets";
import { cloudflareBucketUrl } from "../globalVariables";

import PhotoCommentsScreen from "./photoCommentsScreen";

import { useSharedValue } from "react-native-reanimated";

type PhotoCommentsParallaxProps = {
  id: number;
};

export default function PhotoCommentsParallax({ id }: PhotoCommentsParallaxProps) {

  const contentScrollY = useSharedValue(0);

  const navigation = useAppNavigation();
  const [headerUri, setHeaderUri] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const pic = await getPhotoByID(id);
      const picFileName = pic?.[0]?.photoFile?.split("/")?.pop();
      const uri = picFileName ? `${cloudflareBucketUrl}${picFileName}` : null;

      if (isMounted) setHeaderUri(uri);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onClose = () => {
    navigation.goBack();
  };

  const onNavigate = () => {
    Keyboard.dismiss();
  };

  const popoverContent = () => {
    return null;
  };

  const headerImage = useMemo(() => {
    return headerUri ? { uri: headerUri } : noImage;
  }, [headerUri]);

  return (
    <ParallaxDrawer
      headerImage={headerImage}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverContent={popoverContent}
      isMyShop={false}
      contentScrollY={contentScrollY}
    >
      <PhotoCommentsScreen id={id} contentScrollY={contentScrollY}/>
    </ParallaxDrawer>
  );
}
