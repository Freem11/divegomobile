
export type DBPhotoRecord = {
  decision: string | null;
  id: number
  photoPath: string;
  review_id: number
};

export const photoFateDeterminer = (currentPhotoData: DBPhotoRecord[], newPhotoData: string[] ) => {

  console.log("currentPhotoData", currentPhotoData);
  console.log("newPhotoData", newPhotoData);

  const currentPaths = currentPhotoData.map(item => item.photoPath);
  const currentPathsSet = new Set(currentPaths);

  const newPathsSet = new Set(newPhotoData);

  const deletes = currentPaths.filter(path => !newPathsSet.has(path));
  const uploads = newPhotoData.filter(path => !currentPathsSet.has(path));

  return {
    deletes,
    uploads
  };

};