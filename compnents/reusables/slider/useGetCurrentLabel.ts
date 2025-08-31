
export const useGetCurrentLabel = (rightValue: number, value: number): string => {
  if (rightValue <= 0 || value === 0) {
    return "";
  }

  const onePercent = rightValue / 100;

  if (value > 0 && value <= onePercent * 25) {
    return "Weak Drift:";
  } else if (value > onePercent * 20 && value <= onePercent * 50) {
    return "Typical Drift:";
  } else if (value > onePercent * 40 && value <= onePercent * 75) {
    return "Strong Drift:";
  } else if (value > onePercent * 75) {
    return "Extreme Drift:";
  } else {
    return "";
  }
};