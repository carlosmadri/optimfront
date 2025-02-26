import { roundToDecimalPlaces, getOverallMinMax } from './number-utils';

describe('NumberUtils', () => {
  describe('roundToDecimalPlaces', () => {
    it('should round to one decimal place', () => {
      expect(roundToDecimalPlaces(3.33333, 1)).toBe(3.3);
    });

    it('should round up with one decimal place', () => {
      expect(roundToDecimalPlaces(3.39, 1)).toBe(3.4);
    });

    it('should round to two decimal places', () => {
      expect(roundToDecimalPlaces(3.33333, 2)).toBe(3.33);
    });

    it('should handle negative numbers', () => {
      expect(roundToDecimalPlaces(-3.33333, 1)).toBe(-3.3);
    });

    it('should handle zero decimal places', () => {
      expect(roundToDecimalPlaces(3.33333, 0)).toBe(3);
    });
  });

  describe('getOverallMinMax', () => {
    it('should return correct min and max for a 2D array', () => {
      const data = [
        [1, 2, 3],
        [-1, 5, 0],
      ];
      expect(getOverallMinMax(data)).toEqual({ min: -1, max: 5 });
    });

    it('should return correct min and max for a single row array', () => {
      const data = [[1, 2, 3]];
      expect(getOverallMinMax(data)).toEqual({ min: 1, max: 3 });
    });

    it('should return correct min and max for an array with negative numbers', () => {
      const data = [
        [-10, -20, -30],
        [-1, -5, -15],
      ];
      expect(getOverallMinMax(data)).toEqual({ min: -30, max: -1 });
    });

    it('should return correct min and max for an array with mixed positive and negative numbers', () => {
      const data = [
        [10, -20, 30],
        [-1, 5, -15],
      ];
      expect(getOverallMinMax(data)).toEqual({ min: -20, max: 30 });
    });

    it('should handle an empty 2D array', () => {
      const data: number[][] = [];
      expect(getOverallMinMax(data)).toEqual({ min: Infinity, max: -Infinity });
    });

    it('should handle an array with empty sub-arrays', () => {
      const data = [[], []];
      expect(getOverallMinMax(data)).toEqual({ min: Infinity, max: -Infinity });
    });
  });
});
