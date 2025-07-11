function formatDate(dateTaken) {

  const slicedDate = dateTaken.substring(0, 10);
  const formattedDate1 = slicedDate.replace(":", "-");
  const formattedDate = formattedDate1.replace(":", "-");
  return formattedDate;
}

function createFile(dateTaken, fileSize) {

 
  const fileName = dateTaken.substring(
    dateTaken.lastIndexOf("/") + 1,
    dateTaken.length
  );

  const fileToUpload = {
    uri: dateTaken,
    name: fileName,
    type: "image/jpg",
    fileSize: fileSize,
  };
  return fileToUpload
}
export { formatDate, createFile };
