import { MonthlyDistributionAdapter } from './monthly-distribution.adapter';
import { MonthlyDistributionAPI, MONTHLY_CHART_DATA } from '../../models/monthly-distribution.model';
import { LineChartData, MONTHS_LIST } from '../../models/graphs/line-chart.model';
import { TestBed } from '@angular/core/testing';
import { ChartColors, ChartIds } from '../../models/worksync.model';

describe('MonthlyDistributionAdapter', () => {
  let adapter: MonthlyDistributionAdapter;

  const mockMonthlyChartData: LineChartData = {
    month: [...MONTHS_LIST, 'EoY'],
    labels: MONTHLY_CHART_DATA.map((data) => data.label),
    colors: MONTHLY_CHART_DATA.map((data) => data.color),
    ids: [ChartIds.OPTIMISTIC, ChartIds.VALIDATION, ChartIds.REALISTIC, ChartIds.OP, ChartIds.FCII, ChartIds.WIP, ChartIds.FIRST_SUBMISSION],
    showAvg: MONTHLY_CHART_DATA.map((data) => data.showAvg),
    specificPoint: 100,
    specificPointColor: ChartColors.HC_CEILING,
    specificPointLabel: 'HC Baseline',
    values: [
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
      [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
      [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
      [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126],
      [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131],
      [4, 24, 34, 44, 54, 64, 74, 84, 94, 104, 114, 124, 134],
      [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136],
    ],
  };

  const mockMonthlyChartDataNoFirstSubmission: LineChartData = {
    month: [...MONTHS_LIST, 'EoY'],
    labels: MONTHLY_CHART_DATA.filter((data) => data.name !== ChartIds.FIRST_SUBMISSION).map((data) => data.label),
    colors: MONTHLY_CHART_DATA.filter((data) => data.name !== ChartIds.FIRST_SUBMISSION).map((data) => data.color),
    ids: [ChartIds.OPTIMISTIC, ChartIds.VALIDATION, ChartIds.REALISTIC, ChartIds.OP, ChartIds.FCII, ChartIds.WIP],
    showAvg: MONTHLY_CHART_DATA.filter((data) => data.name !== ChartIds.FIRST_SUBMISSION).map((data) => data.showAvg),
    specificPoint: 100,
    specificPointColor: ChartColors.HC_CEILING,
    specificPointLabel: 'HC Baseline',
    values: [
      [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
      [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
      [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
      [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126],
      [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131],
      [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136],
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthlyDistributionAdapter],
    });
    adapter = TestBed.inject(MonthlyDistributionAdapter);
  });

  describe('adaptMonthlDistribution', () => {
    it('should adapt MonthlyDistributionAPI to LineChartData correctly for all the data', () => {
      const apiData: MonthlyDistributionAPI = {
        hcCeiling: 100,
        optimisticView: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
        validationView: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
        realisticView: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
        op: [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126],
        fcii: [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131],
        bottomUp: [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136],
        firstSubmission: [4, 24, 34, 44, 54, 64, 74, 84, 94, 104, 114, 124, 134],
        wipValue: 'WIP',
      };

      const result = adapter.adapt(apiData);
      expect(result).toEqual(mockMonthlyChartData);
    });

    it('should adapt MonthlyDistributionAPI to LineChartData correctly when there is no First submission data', () => {
      const apiData: MonthlyDistributionAPI = {
        hcCeiling: 100,
        optimisticView: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
        validationView: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
        realisticView: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
        op: [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126],
        fcii: [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131],
        bottomUp: [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136],
        wipValue: 'WIP',
      };

      const result = adapter.adapt(apiData);
      expect(result).toEqual(mockMonthlyChartDataNoFirstSubmission);
    });

    it('should display the WIP data with the correct label if the WIP value is not WIP', () => {
      const apiData: MonthlyDistributionAPI = {
        hcCeiling: 100,
        optimisticView: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
        validationView: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
        realisticView: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
        op: [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126],
        fcii: [11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131],
        bottomUp: [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136],
        wipValue: 'QMC',
      };

      const result = adapter.adapt(apiData);

      expect(result!.labels).toContain('QMC');
      expect(result!.labels).not.toContain('WIP');
    });
  });

  describe('filterMonthlyDistributionLines', () => {
    it('should display all the lines if all the checks are selected', () => {
      const selectedChecks: ChartIds[] = [
        ChartIds.OPTIMISTIC,
        ChartIds.REALISTIC,
        ChartIds.VALIDATION,
        ChartIds.WIP,
        ChartIds.FCII,
        ChartIds.OP,
        ChartIds.FIRST_SUBMISSION,
      ];

      const result = adapter.filterMonthlyDistributionLines(mockMonthlyChartData, selectedChecks);

      expect(result).toEqual(mockMonthlyChartData);
    });

    it('should display all the Workload lines if all the Workload checks are selected', () => {
      const selectedChecks: ChartIds[] = [ChartIds.WIP, ChartIds.FCII, ChartIds.OP];

      const expectedResult = {
        ...mockMonthlyChartData,
        values: [mockMonthlyChartData.values[3], mockMonthlyChartData.values[4], mockMonthlyChartData.values[5]],
        ids: [ChartIds.OP, ChartIds.FCII, ChartIds.WIP],
        labels: ['OP', 'FCII', 'WIP'],
        colors: ['#76b7b2', '#59a14f', '#edc949'],
        showAvg: [false, false, false],
      };

      const result = adapter.filterMonthlyDistributionLines(mockMonthlyChartData, selectedChecks);

      expect(result).toEqual(expectedResult);
    });

    it('should display all the Workforce lines if all the Workforce checks are selected', () => {
      const selectedChecks: ChartIds[] = [ChartIds.OPTIMISTIC, ChartIds.REALISTIC, ChartIds.VALIDATION];

      const expectedResult = {
        ...mockMonthlyChartData,
        values: [mockMonthlyChartData.values[0], mockMonthlyChartData.values[1], mockMonthlyChartData.values[2]],
        ids: [ChartIds.OPTIMISTIC, ChartIds.VALIDATION, ChartIds.REALISTIC],
        labels: ['Optimistic', 'Validation', 'Realistic'],
        colors: [ChartColors.OPTIMISTIC, ChartColors.VALIDATION, ChartColors.REALISTIC],
        showAvg: [true, true, true],
      };

      const result = adapter.filterMonthlyDistributionLines(mockMonthlyChartData, selectedChecks);

      expect(result).toEqual(expectedResult);
    });

    it('should display no lines if no checks are selected', () => {
      const selectedChecks: ChartIds[] = [];
      const expectedResult = {
        ...mockMonthlyChartData,
        ids: [],
        values: [],
        labels: [],
        colors: [],
        showAvg: [],
      };

      const result = adapter.filterMonthlyDistributionLines(mockMonthlyChartData, selectedChecks);

      expect(result).toEqual(expectedResult);
    });
  });
});
