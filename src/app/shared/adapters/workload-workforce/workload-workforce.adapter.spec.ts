import { TestBed } from '@angular/core/testing';

import { WorkloadWorkforceAdapter } from './workload-workforce.adapter';
import { ChartColors, ChartIds, WorkloadWorkforce, WorkloadWorkforceAPI } from '../../models/worksync.model';

describe('WorkloadWorkforceAdapter', () => {
  let service: WorkloadWorkforceAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkloadWorkforceAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly adapt data', () => {
    const input: WorkloadWorkforceAPI = {
      exerciseOP: 1,
      exerciseFCII: 2,
      exerciseBU: 3,
      exerciseQMC: 4.18,
      exerciseT1Q: 9,
      optimisticView: 5,
      validationView: 6,
      realisticView: 7,
      hcCeiling: 8,
    };

    const expected: WorkloadWorkforce[] = [
      {
        id: ChartIds.OP,
        label: 'OP',
        value: 1,
        color: ChartColors.OP,
      },
      {
        id: ChartIds.FCII,
        label: 'FCII',
        value: 2,
        color: ChartColors.FCII,
      },
      {
        id: ChartIds.WIP,
        label: 'WIP',
        value: 3,
        color: ChartColors.WIP,
      },
      {
        id: ChartIds.QMC,
        label: 'QMC',
        value: 4.2,
        color: ChartColors.QMC,
      },
      {
        id: ChartIds.HOT1Q,
        label: 'HOT1Q',
        value: 9,
        color: ChartColors.HOQ1T,
      },
      {
        id: ChartIds.OPTIMISTIC,
        label: 'Optimistic',
        value: 5,
        color: ChartColors.OPTIMISTIC,
      },
      {
        id: ChartIds.VALIDATION,
        label: 'Validation',
        value: 6,
        color: ChartColors.VALIDATION,
      },
      {
        id: ChartIds.REALISTIC,
        label: 'Realistic',
        value: 7,
        color: ChartColors.REALISTIC,
      },
      {
        id: ChartIds.HC_CEILING,
        label: 'HC Ceiling',
        value: 8,
        color: ChartColors.HC_CEILING,
      },
    ];
    const result = service.adapt(input);
    expect(result).toEqual(expect.objectContaining(expected));
  });
});
