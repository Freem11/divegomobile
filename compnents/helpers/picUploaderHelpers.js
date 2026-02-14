function getToday(DateVal) {
  const yr0 = DateVal.getFullYear().toString();
  let mth0 = (DateVal.getMonth() + 1).toString();
  let dy0 = DateVal.getDate().toString();

  if (dy0.length == 1) {
    dy0 = "0" + dy0;
  }

  if (mth0.length == 1) {
    mth0 = "0" + mth0;
  }

  const formattedDate = yr0 + "-" + mth0 + "-" + dy0;

  return formattedDate;
}

function getDate(DateVal) {

  const yr0 = strDate.substing(0, 4);
  const mth0 = strDate.substing(5, 8);
  const dy0 = strDate.substing(8, 11);

  const formattedDate = yr0 + "-" + mth0 + "-" + dy0;

  return formattedDate;
}

export { getToday, getDate };
