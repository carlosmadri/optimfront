import { BorrowedLeasedAdapter } from './borrowed-leased.adapter';
import { MONTHS_LIST } from '../../models/graphs/line-chart.model';
import { TestBed } from '@angular/core/testing';
import { BORROWED_CHART_DATA, BorrowedLeased, BorrowedLeasedAPI } from '../../models/borrowed-leased.model';

describe('BorrowedLeasedAdapter', () => {
  let adapter: BorrowedLeasedAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BorrowedLeasedAdapter],
    });
    adapter = TestBed.inject(BorrowedLeasedAdapter);
  });

  describe('adapt', () => {
    const mockBorrowChartData: BorrowedLeased = {
      chartData: {
        month: MONTHS_LIST,
        colors: BORROWED_CHART_DATA.map((data) => data.color),
        showAvg: BORROWED_CHART_DATA.map((data) => data.showAvg),
        values: [
          [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
          [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
        ],
      },
      averageBorrowed: 50,
      averageLeased: 60,
      netDifference: 10,
    };
    it('should adapt BorrowedLeasedAPI to BorrowedLeased correctly for all the data', () => {
      const apiData: BorrowedLeasedAPI = {
        borrowedMonthlyDistribution: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        leasedMonthlyDistribution: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125],
        averageBorrowed: 50,
        averageLeased: 60,
        netDifference: 10,
      };

      const result = adapter.adapt(apiData);
      expect(result).toEqual(mockBorrowChartData);
    });
  });
});
