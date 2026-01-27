export default function abbreviateNumber(number: number) {
  // Handle 0 or non-numeric values early
  if (!number || number < 1000) return number?.toString() || "0";

  const abbreviations = ["K", "M", "B", "T"];
  let abbreviationIndex = -1; // Start at -1 because 1000/1000 = index 0 ('K')

  while (number >= 1000 && abbreviationIndex < abbreviations.length - 1) {
    number /= 1000;
    abbreviationIndex++;
  }

  // Use fixed precision (e.g., 1.5K) and ensure we have a valid index
  const formattedNumber = Math.floor(number * 10) / 10;
  return formattedNumber + abbreviations[abbreviationIndex];
}