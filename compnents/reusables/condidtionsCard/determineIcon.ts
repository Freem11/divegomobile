
export function determineIcon(first: string, rest: string[]) {

  console.log(rest);

  if (rest.includes("Current")) {
    return "more";
  }
  if (rest.includes("Lateral")) {
    return "arrow-left-right";
  }

  if (rest.includes("Upwellings")) {
    return "circle-arrow-up";
  }

  if (rest.includes("Downwellings")) {
    return "circle-arrow-down";
  }

  if (rest.includes("Contrasting")) {
    return "arrow-left-right-reverse";
  }

  if (rest.includes("Visibility")) {
    return "diving-snorkel";
  }
}