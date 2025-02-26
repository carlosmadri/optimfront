import { Injectable } from '@angular/core';
import { LineChartData, MONTHS_LIST } from '../../models/graphs/line-chart.model';
import { BORROWED_CHART_DATA, BorrowedLeased, BorrowedLeasedAPI } from '../../models/borrowed-leased.model';
import { Adapter } from '../adapter.interface';

@Injectable({
  providedIn: 'root',
})
export class BorrowedLeasedAdapter implements Adapter<BorrowedLeasedAPI, BorrowedLeased> {
  adapt(data: BorrowedLeasedAPI): BorrowedLeased | null {
    if (!data) {
      return null;
    }

    const chartData: LineChartData = {
      month: MONTHS_LIST,
      colors: BORROWED_CHART_DATA.map((data) => data.color),
      showAvg: BORROWED_CHART_DATA.map((data) => data.showAvg),
      values: [data.borrowedMonthlyDistribution, data.leasedMonthlyDistribution],
    };

    const borrowedLeased: BorrowedLeased = {
      chartData: chartData,
      averageBorrowed: data.averageBorrowed,
      averageLeased: data.averageLeased,
      netDifference: data.netDifference,
    };

    return borrowedLeased;
  }
}
