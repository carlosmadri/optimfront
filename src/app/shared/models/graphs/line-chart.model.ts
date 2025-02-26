import { ChartIds } from '../worksync.model';

export interface LineChartData {
  month: string[];
  values: number[][];
  labels?: string[];
  ids?: ChartIds[];
  colors: string[];
  showAvg: boolean[];
  specificPoint?: number;
  specificPointColor?: string;
  specificPointLabel?: string;
}

export const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
