function addIconType(array, sourceImage) {
  const newArr = [];
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
  const newArr = [];
  let count = 1;
  array &&
    array.forEach((animal) => {
      if (animal.id !== 0) {
        const tempVal = { ...animal , id: count };
        newArr.push(tempVal);
      }
      count++;
    });
  return newArr;
}

export { addIconType, addIndexNumber };
