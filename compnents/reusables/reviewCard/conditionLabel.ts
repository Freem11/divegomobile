import { DiveConditions } from "../../../entities/diveSiteCondidtions";
import { ReviewCondition } from "../../../entities/diveSiteReview";

export function renderLabel(condition: ReviewCondition) {
  const getStrength = (value) => {
    if (value <= 0.5) {
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
    case 1:
    case 7:
    case 14:
      return null;
    case 2:
      return "Boat Dive";
    case 3:
      return "Night Diving Possible";
    case 4:
      return "Dive at Altitude";
    case 5:
      return "Wreck Dive";
    case 6:
      return "Cave Dive";
    case 8:
      return "Fresh Water Dive";
    case 9:
      return "Surface Traffic Observed";
    case 10:
      return "Surge Encountered";
    case 11:
      return "No reference points";
    case 12:
      return "Bottom Depth is greater than AOW";
    case 13:
      return "Kelp present";
    case 15:
      if (condition.value < 10) {
        return "Poor Vizibility";
      } else if (condition.value > 10 && condition.value < 20) {
        return "Moderate Vizibility";
      } else {
        return "Great Vizibility";
      }
    case 16:
      return null;
    case 17:
      return `${getStrength(condition.value)} Latteral Currents`;
    case 18:
      return `${getStrength(condition.value)} Up-wellings`;
    case 19:
      return `${getStrength(condition.value)} Down-wellings`;
    case 20:
      return `${getStrength(condition.value)} Contrasting Currents`;
    default:
      return null;
  }
}