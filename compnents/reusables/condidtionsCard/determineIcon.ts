
export function determineIcon(first: string, rest: string[]) {

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

export function determineChipIcon(conditionText: string) {

  if (conditionText === "Boat Dive") {
    return "sailboat";
  }

  if (conditionText === "Shore Dive") {
    return "island";
  }

  if (conditionText === "Wreck Dive") {
    return "anchor-alt";
  }

  if (conditionText === "Altitude Dive") {
    return "mountains";
  }

  if (conditionText === "Cave Dive") {
    return "vinyl-record";
  }

  if (conditionText === "Surge") {
    return "waves";
  }

  if (conditionText === "Surface Traffic") {
    return "traffic-light";
  }

  if (conditionText === "No Reference Points") {
    return "GPS-splash";
  }

  if (conditionText === "Bottom?") {
    return "warning-diamond";
  }

  if (conditionText === "Kelp") {
    return "plant";
  }

  if (conditionText === "pollution") {
    return "beer-bottle";
  }

  if (conditionText === "Night Dive") {
    return "moon-stars";
  }

  if (conditionText === "Salt Water") {
    return "salt-water";
  }

  if (conditionText === "Fresh Water") {
    return "fresh-water";
  }

}