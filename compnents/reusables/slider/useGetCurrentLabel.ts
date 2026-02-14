import { colors } from "../../styles";

type LabelStyles = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

type LabelResult = {
  label: string;
  styles: LabelStyles;
};

const getLabelColors = (label: string): LabelStyles => {
  switch (label) {
    case "Weak Drift":
      return {
        backgroundColor: colors.greenLighter,
        borderColor: colors.greenLight,
        textColor: colors.green
      };
    case "Typical Drift":
      return {
        backgroundColor: colors.yellowLighter,
        borderColor: colors.yellowLight,
        textColor: colors.yellow
      };
    case "Strong Drift":
      return {
        backgroundColor: colors.orangeLighter,
        borderColor: colors.orangeLight,
        textColor: colors.orange
      };
    case "Extreme Drift":
      return {
        backgroundColor: colors.redLighter,
        borderColor: colors.redLight,
        textColor: colors.red
      };
    default:
      return {
        backgroundColor: colors.lighterBlue,
        borderColor: colors.borderActive,
        textColor: colors.primaryBlue
      };
  }
};

export const useGetCurrentLabel = (rightValue: number, value: number): LabelResult => {
  let label = "";

  if (rightValue > 0 && value > 0) {
    const onePercent = rightValue / 100;

    if (value > 0 && value <= onePercent * 25) {
      label = "Weak Drift";
    } else if (value > onePercent * 20 && value <= onePercent * 50) {
      label = "Typical Drift";
    } else if (value > onePercent * 40 && value <= onePercent * 75) {
      label = "Strong Drift";
    } else if (value > onePercent * 75) {
      label = "Extreme Drift";
    }
  }

  return {
    label,
    styles: getLabelColors(label)
  };
};