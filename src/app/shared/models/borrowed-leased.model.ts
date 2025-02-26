import { LineChartData } from './graphs/line-chart.model';

export interface BorrowedLeasedAPI {
  leasedMonthlyDistribution: number[];
  borrowedMonthlyDistribution: number[];
  averageBorrowed: number;
  averageLeased: number;
  netDifference: number;
}

export interface BorrowedLeased {
  chartData: LineChartData | null;
  averageBorrowed: number;
  averageLeased: number;
  netDifference: number;
}

export interface BorrowedChartData {
  label: string;
  showAvg: boolean;
  color: string;
}

export const BORROWED_CHART_DATA: readonly Readonly<BorrowedChartData>[] = [
  { label: 'Borrowed', showAvg: false, color: '#D6490B' },
  { label: 'Leased', showAvg: false, color: '#DFA800' },
];
