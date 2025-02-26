import { ChartColors, ChartIds, ChartSelectorData } from './worksync.model';

export interface MonthlyDistributionAPI {
  optimisticView: number[];
  validationView: number[];
  realisticView: number[];
  bottomUp?: number[];
  firstSubmission?: number[];
  fcii: number[];
  op: number[];
  hcCeiling: number;
  wipValue: string;
}

export const MONTHLY_CHART_DATA: ChartSelectorData[] = [
  { label: 'Optimistic', showAvg: true, name: ChartIds.OPTIMISTIC, color: ChartColors.OPTIMISTIC },
  { label: 'Validation', showAvg: true, name: ChartIds.VALIDATION, color: ChartColors.VALIDATION },
  { label: 'Realistic', showAvg: true, name: ChartIds.REALISTIC, color: ChartColors.REALISTIC },
  { label: 'OP', showAvg: false, name: ChartIds.OP, color: ChartColors.OP },
  { label: 'FCII', showAvg: false, name: ChartIds.FCII, color: ChartColors.FCII },
  { label: 'WIP', showAvg: false, name: ChartIds.WIP, color: ChartColors.WIP },
  { label: 'First Sub.', showAvg: false, name: ChartIds.FIRST_SUBMISSION, color: ChartColors.FIRST_SUBMISSION },
];
