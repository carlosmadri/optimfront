import { TestBed } from '@angular/core/testing';

import { WorkloadPerProgramAdapter } from './workload-per-program.adapter';
import { WorkloadPerProgramAPI } from '../models/worksync.model';
import { LineDetailChartData } from '../models/graphs/line-detail-chart.model';

describe('WorkloadPerProgramAdapterService', () => {
  let service: WorkloadPerProgramAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkloadPerProgramAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array if data is empty', () => {
    const result = service.adapt([]);
    expect(result).toEqual([]);
  });

  it('should correctly adapt data', () => {
    const input: WorkloadPerProgramAPI[] = [
      {
        programName: 'Program 1',
        programKHrsSum: 1.26,
        programsCount: 2,
      },
      {
        programName: 'Program 2',
        programKHrsSum: 3,
        programsCount: 4,
      },
    ];

    const expected: LineDetailChartData[] = [
      {
        name: 'Program 1',
        khours: 1.3,
        programs: 2,
      },
      {
        name: 'Program 2',
        khours: 3,
        programs: 4,
      },
    ];

    const result = service.adapt(input);
    expect(result).toEqual(expected);
  });
});
