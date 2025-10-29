
export type DBPhotoRecord = {
  decision: string | null;
  id: number
  photoPath: string;
  review_id: number
};

const PREFIX = "animalphotos/public/";

export const photoFateDeterminer = (currentPhotoData: DBPhotoRecord[], newPhotoData: string[] ) => {

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

  // if path is on original list but not new -> put on deletes list
  // if path is on new list but not original -> put on uploads list
  // if path exisits on both lists -> no need to delete or upload

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

export const urlSanitizer = (newlyUploadedUrls: string[], existingUrls: string[] ) => {

  //get file names and paths for newly uploaded files
  const newUrlsArray = newlyUploadedUrls.map(fileName => (fileName));

  //remove temporary paths for newly uplpoaded files
  const remoteUrls =  existingUrls.filter(path =>
    !path.startsWith("file")
  );

  //clean existing paths from cloudflare paths back to paths stored in Db
  const reformatedRemoteUrls = remoteUrls.map(url => {
    const lastSlashIndex = url.lastIndexOf("/");
    const filename = url.substring(lastSlashIndex + 1);
    return PREFIX + filename;
  });

  const combinedUrls = [ ...reformatedRemoteUrls, ...newUrlsArray];
  const cleanUrls = new Set(combinedUrls);

  return { cleanUrls };
};