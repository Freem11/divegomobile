function formatDate(dateTaken) {

  let slicedDate = dateTaken.substring(0, 10);
  let formattedDate1 = slicedDate.replace(":", "-");
  let formattedDate = formattedDate1.replace(":", "-");
  return formattedDate;
}

function createFile(dateTaken) {

 
    let fileName = dateTaken.substring(
        dateTaken.lastIndexOf("/") + 1,
        dateTaken.length
      );
      console.log("hmmm", fileName)
      console.log("ahhh", dateTaken)

      const fileToUpload = {
        uri: dateTaken,
        name: fileName,
        type: "image/jpg",
      };
      return fileToUpload
}
export { formatDate, createFile };
