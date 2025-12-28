import { ReviewCondition } from "../../../entities/diveSiteReview";

//1 = shore dive -> if present yes
//2 = boat dive -> no need to show
//3 = night dive -> if present yes
//4 = altitude -> if present yes
//5 = wreck -> if present yes
//6 = cave -> if present yes
//7 = salt water -> no need to show
//8 = fresh water -> if present yes
//9 = surface traffic -> if present yes
//10 = surge -> if present yes
//11 = no ref points -> if present yes
//12 = bottom depth -> if present yes
//13 = kelp -> if present yes
//14 = pollution -> if present yes
//15 = viz -> generally x viz
//16 = current intensity -> generally x currents
//17 = latteral -> most common of the 4
//18 = upwelling -> most common of the 4
//19 = downwelling -> most common of the 4
//20 = contrasting -> most common of the 4

export function renderStatLabel(condition: ReviewCondition) {

  const getStrength = (value) => {
    if (value <= 1) {
      return "Weak";
    } else if (value <= 1.5) {
      return "Moderate";
    } else if (value <= 2) {
      return "Strong";
    } else {
      return "Dangerous";
    }
  };

  switch (condition.condition_type_id) {
    case 2:
    case 7:
    case 14:
      return null;
    case 1:
      return "Shore Dive";
    case 3:
      return "Night Diving";
    case 4:
      return "Altitude";
    case 5:
      return "Wreck Dive";
    case 6:
      return "Cave Dive";
    case 8:
      return "Fresh Water";
    case 9:
      return "Surface Traffic";
    case 10:
      return "Surge";
    case 11:
      return "No Reference Points";
    case 12:
      return "Bottom Depth > AOW";
    case 13:
      return "Kelp";
    case 15:
      if (condition.value < 10) {
        return "Poor Visibility";
      } else if (condition.value > 10 && condition.value < 20) {
        return "Moderate Visibility";
      } else {
        return "Great Visibility";
      }
    case 16:
      return null;
    case 17:
      return `${getStrength(condition.value)} Lateral Currents`;
    case 18:
      return `${getStrength(condition.value)} Upwellings`;
    case 19:
      return `${getStrength(condition.value)} Downwellings`;
    case 20:
      return `${getStrength(condition.value)} Contrasting Currents`;
    default:
      return null;
  }
}