import { readAsync } from "@lodev09/react-native-exify";
import { ImagePickerAsset } from "expo-image-picker";
import RNQRGenerator from "rn-qr-generator";
import * as ImageManipulator from "expo-image-manipulator";

export const processPhotosForSync = async (pictures: ImagePickerAsset[]) => {
    let syncOffset = 0;
    let anchorFound = false;
    let anchorDetails = { qrTime: null, cameraTime: null, uri: null };

    const scanPhoto = async (pic: ImagePickerAsset) => {
        try {
            // --- THE SPEED FIX: Create a tiny version for the QR scanner ---
            // This reduces the pixels to scan by about 90%
            const resized = await ImageManipulator.manipulateAsync(
                pic.uri,
                [{ resize: { width: 800 } }],
                { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );

            const { values } = await RNQRGenerator.detect({ uri: resized.uri });
            const qrCheck = values.find(v => v.includes("ScubaSEAsons:"));

            if (qrCheck) {
                const atomicTime = parseInt(qrCheck.split("ScubaSEAsons:")[1]);
                const tags = await readAsync(pic.uri);
                const cameraTimeStr = tags?.DateTimeOriginal || tags?.DateTimeDigitized;

                const formattedDate = cameraTimeStr ? cameraTimeStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3") : null;
                const cameraTime = formattedDate ? new Date(formattedDate).getTime() : Date.now();

                syncOffset = atomicTime - cameraTime;
                anchorFound = true;
                anchorDetails = {
                    qrTime: new Date(atomicTime).toISOString(),
                    cameraTime: new Date(cameraTime).toISOString(),
                    uri: pic.uri
                };
                return true;
            }
        } catch (e) {
            console.log("Scan error", e);
        }
        return false;
    };

    // 1. Priority Scan (First and Last)
    const priorityTargets = [pictures[0], pictures.length > 1 ? pictures[pictures.length - 1] : null].filter(Boolean) as ImagePickerAsset[];
    for (const pic of priorityTargets) {
        if (await scanPhoto(pic)) break;
    }

    // 2. Middle Scan (Sequential but resized - much faster)
    if (!anchorFound && pictures.length > 2) {
        const middlePics = pictures.slice(1, -1);
        for (const pic of middlePics) {
            if (await scanPhoto(pic)) break;
        }
    }

    // 3. Map all photos with ISO strings (This uses original URI)
    const processedPhotos = await Promise.all(pictures.map(async (pic) => {
        const tags = await readAsync(pic.uri);
        const cameraTimeStr = tags?.DateTimeOriginal || tags?.DateTimeDigitized;
        const formattedDate = cameraTimeStr ? cameraTimeStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3") : null;
        const cameraTime = formattedDate ? new Date(formattedDate).getTime() : Date.now();

        return {
            uri: pic.uri,
            isAnchor: pic.uri === anchorDetails.uri,
            oldDate: new Date(cameraTime).toISOString(),
            newDate: new Date(cameraTime + syncOffset).toISOString(),
        };
    }));

    return {
        photos: processedPhotos,
        offset: syncOffset,
        anchorFound,
        debug: anchorDetails
    };
};