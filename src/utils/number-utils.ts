export const roundToDecimalPlaces = (num: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

export const getOverallMinMax = (values: number[][]): { min: number; max: number } => {
  const allValues = values.flat();
  return {
    min: Math.min(...allValues),
    max: Math.max(...allValues),
  };
};
