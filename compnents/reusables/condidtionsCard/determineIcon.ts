import { colors } from "../../styles";

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

  if (conditionText === "Altitude") {
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

  if (conditionText === "Bottom Depth > AOW Limits") {
    return "warning-diamond";
  }

  if (conditionText === "Kelp") {
    return "plant";
  }

  if (conditionText === "Pollution") {
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

export function determineViz(vizVal: number) {

  if (vizVal >= 0 && vizVal <= 3) {
    return { bgColor: colors.red, textColor: colors.themeWhite };
  }

  if (vizVal > 3 && vizVal <= 10) {
    return { bgColor: colors.orangeLight, textColor: colors.themeBlack };
  }

  if (vizVal > 10 && vizVal <= 20) {
    return { bgColor: colors.primaryBlue, textColor: colors.themeWhite };
  }

  if (vizVal > 20) {
    return { bgColor: colors.greenLight, textColor: colors.themeBlack };
  }

}

export function determineIntensity(intensityVal: string) {

  if (intensityVal === "No") {
    return { bgColor: colors.greenLight, textColor: colors.themeBlack };
  }

  if (intensityVal === "Weak") {
    return { bgColor: colors.primaryBlue, textColor: colors.themeWhite };
  }

  if (intensityVal === "Moderate") {
    return { bgColor: colors.yellow, textColor: colors.themeBlack };
  }

  if (intensityVal === "Strong") {
    return { bgColor: colors.orangeLight, textColor: colors.themeBlack };
  }

  if (intensityVal === "Dangerous") {
    return { bgColor: colors.red, textColor: colors.themeBlack };
  }

}