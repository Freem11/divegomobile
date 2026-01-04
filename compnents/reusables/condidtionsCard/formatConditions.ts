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

export function formatConditions(condition: ReviewCondition, intensityValue: number) {

  const getStrength = (value: number) => {
    if (value <= 0.5) {
      return "Weak";
    } else if (value <= 1) {
      return "Moderate";
    } else if (value <= 1.5) {
      return "Strong";
    } else {
      return "Dangerous";
    }
  };

  switch (condition.condition_type_id) {
    case 2:
      return { id: 2, value: "Boat Dive" };
    case 7:
      return { id: 7, value: "Salt Water" };
    case 14:
      return { id: 14, value: "Pollution" };
    case 1:
      return { id: 1, value: "Shore Dive" };
    case 3:
      return { id: 3, value: "Night Dive" };
    case 4:
      return { id: 4, value: "Altitude" };
    case 5:
      return { id: 5, value: "Wreck Dive" };
    case 6:
      return { id: 6, value: "Cave Dive" };
    case 8:
      return { id: 8, value: "Fresh Water" };
    case 9:
      return { id: 9, value: "Surface Traffic" };
    case 10:
      return { id: 10, value: "Surge" };
    case 11:
      return { id: 11, value: "No Reference Points" };
    case 12:
      return { id: 12, value: "Bottom Depth > AOW Limits" };
    case 13:
      return { id: 13, value: "Kelp" };
    case 15:
      return { id: 15, value: `${condition.value}m Visibility` };
    case 16:
      return {};
    case 17:
      return { id: 17, value: `${getStrength(intensityValue)} Lateral Currents` };
    case 18:
      return { id: 18, value: `${getStrength(intensityValue)} Upwellings` };
    case 19:
      return { id: 19, value: `${getStrength(intensityValue)} Downwellings` };
    case 20:
      return { id: 20, value: `${getStrength(intensityValue)} Contrasting Currents` };
    default:
      return null;
  }
}