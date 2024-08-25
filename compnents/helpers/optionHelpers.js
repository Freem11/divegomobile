export default function filterCreatures(array, sourceImage) {
  let newArr = [];
  let count = 1;
  array &&
    array.forEach((animal) => {
      if (animal.id !== 0) {
        newArr.push({ id: count, title: animal, source: sourceImage});
      }
      count++;
    });
  return newArr;
}
