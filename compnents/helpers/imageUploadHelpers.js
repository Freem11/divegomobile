function formatDate(dateTaken) {

  let slicedDate = dateTaken.substring(0, 10);
  let formattedDate1 = slicedDate.replace(":", "-");
  let formattedDate = formattedDate1.replace(":", "-");
  return formattedDate;
}

function createFile(dateTaken, fileSize) {

 
    let fileName = dateTaken.substring(
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
