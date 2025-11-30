
export type DBPhotoRecord = {
  decision: string | null;
  id: number;
  photoPath: string;
  review_id: number;
};

const PREFIX = "animalphotos/public/";

export const photoFateDeterminer = (
  reviewId: number,
  currentPhotoData: DBPhotoRecord[],
  newPhotoData: string[]
) => {
  const extractFilename = (pathOrUrl: string) => {
    return pathOrUrl.split("/").pop() || "";
  };

  const currentPhotoMap = new Map<string, DBPhotoRecord>();
  currentPhotoData.forEach(item => {
    currentPhotoMap.set(item.photoPath, item);
  });

  const uploads: DBPhotoRecord[] = [];
  const keptExistingRecords: DBPhotoRecord[] = [];

  newPhotoData.forEach(photoUrl => {
    const filename = extractFilename(photoUrl);
    const dbPathCandidate = PREFIX + filename;

    const existingRecord = currentPhotoMap.get(dbPathCandidate);

    if (existingRecord) {
      keptExistingRecords.push(existingRecord);
    } else {
      uploads.push({
        id: 0,
        review_id: reviewId,
        photoPath: photoUrl,
        decision: null,
      } as DBPhotoRecord);
    }
  });

  const keptDbPaths = new Set(keptExistingRecords.map(p => p.photoPath));

  const deletes = currentPhotoData
    .filter(photo => !keptDbPaths.has(photo.photoPath))
    .map(photo => photo.photoPath);

  return {
    reviewPhotos: keptExistingRecords,
    deletes,
    uploads
  };
};