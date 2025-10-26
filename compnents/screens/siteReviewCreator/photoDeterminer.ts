
export type DBPhotoRecord = {
  decision: string | null;
  id: number
  photoPath: string;
  review_id: number
};

export const photoFateDeterminer = (currentPhotoData: DBPhotoRecord[], newPhotoData: string[] ) => {

  const PREFIX = "animalphotos/public/";

  const extractFilename = (pathOrUrl: string) => {
    return pathOrUrl.split("/").pop() || "";
  };

  const currentPaths = currentPhotoData.map(item => item.photoPath);
  const currentPathsSet = new Set(currentPaths);

  const newPaths = newPhotoData.map(url => {
    const filename = extractFilename(url);
    return PREFIX + filename;
  });
  const newPathsSet = new Set(newPaths);

  const deletes = currentPaths.filter(path => !newPathsSet.has(path));

  const uploads = newPhotoData.filter(url => {
    const prefixedPath = PREFIX + extractFilename(url);
    return !currentPathsSet.has(prefixedPath);
  });

  return {
    deletes,
    uploads
  };
};