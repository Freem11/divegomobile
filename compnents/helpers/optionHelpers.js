 function addIconType(array, sourceImage) {
  let newArr = [];
  let count = 1;
  array &&
    array.forEach((animal) => {
      if (animal.id !== 0) {
        newArr.push({ title: animal, source: sourceImage });
      }
      count++;
    });
  return newArr;
}

 function addIndexNumber(array) {
  let newArr = [];
  let count = 1;
  array &&
    array.forEach((animal) => {
      if (animal.id !== 0) {
        let tempVal = {...animal , id: count}
        newArr.push(tempVal);
      }
      count++;
    });
  return newArr;
}

export { addIconType, addIndexNumber };
