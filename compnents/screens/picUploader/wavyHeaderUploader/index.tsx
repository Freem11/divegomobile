import React, { useState } from "react";
import WavyHeaderUploaderView from "./view";
import { chooseImageHandler } from "../../imageUploadHelpers";

export type WavyHeaderUploaderProps = {
  image?: string | null;
  isLoading?: boolean;
  onImageSelect: (uri: string) => void;
};

export default function WavyHeaderUploader({
  image,
  isLoading = false,
  onImageSelect,
}: WavyHeaderUploaderProps) {
  const [innerPicture, setInnerPicture] = useState<string | null>(image);

  // useEffect(() => {
  //   if (!image) {
  //     setInnerPicture(null);
  //   } else if (image.startsWith("file:/")) {
  //     setInnerPicture(image); // Local preview
  //   } else {
  //     const photoName = image.split("/").pop();
  //     setInnerPicture(
  //       `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${photoName}`
  //     );
  //   }
  // }, [image]);

  const handleSelectImage = async () => {
    try {
      const result = await chooseImageHandler();
      if (result?.assets?.[0]?.uri) {
        setInnerPicture(result.assets[0].uri);
        onImageSelect(result.assets[0].uri);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  return (
    <WavyHeaderUploaderView
      imageUri={innerPicture}
      isLoading={isLoading}
      onPressUpload={handleSelectImage}
    />
  );
}
