
import { Image, IMAGE_SIZE } from "../../entities/image";
import { cloudflareBucketUrl } from "../globalVariables";

/**
 * Returns public URL for image
 * @param image
 * @param size
 * @param fallbacks
 * @returns
 */
export default function getImagePublicUrl(image: Image | null, size: IMAGE_SIZE, ...fallbacks: any[]) {
  const fallback = fallbacks.find(Boolean) || "";

  if (!image) {
    return fallback;
  }

  if (image[size] && image.public_domain) {
    return image.public_domain + "/" + image[size];
  }

  // If requested size is not available return original image uploaded by user
  if (image.file_name) {
    const fileName = image.file_name.split("/").pop();
    if (fileName) {
      return cloudflareBucketUrl + `${fileName}`;
    }
  }

  if (image.photoPath) {
    const fileName = image.photoPath.split("/").pop();
    if (fileName) {
      return cloudflareBucketUrl + `${fileName}`;
    }
  }

  if (image.photofile) {
    const fileName = image.photofile.split("/").pop();
    if (fileName) {
      return cloudflareBucketUrl + `${fileName}`;
    }
  }

  return fallback;
}
