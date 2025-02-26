import { TestBed } from '@angular/core/testing';

import { ChartSelectorService } from './chart-selector.service';
import { ChartIds } from '@src/app/shared/models/worksync.model';

describe('ChartSelectorService', () => {
  let service: ChartSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert to Exercise name format the selected checks', () => {
    const selectedChecks = [ChartIds.WIP, ChartIds.FCII, ChartIds.OP, ChartIds.REALISTIC, ChartIds.VALIDATION, ChartIds.OPTIMISTIC];
    const result = selectedChecks.map((data) => service.toExerciseNameFormat(data));
    expect(result).toEqual(['BU', 'FCII', 'OP', 'realistic', 'validation', 'optimistic']);
  });

  describe('setWorkloadChecks', () => {
    it('should set all the workload checks when they exist', () => {
      const checks = [
        ChartIds.FIRST_SUBMISSION,
        ChartIds.WIP,
        ChartIds.FCII,
        ChartIds.QMC,
        ChartIds.HOT1Q,
        ChartIds.OP,
        ChartIds.REALISTIC,
        ChartIds.VALIDATION,
        ChartIds.OPTIMISTIC,
      ];
      const resultChecks = [ChartIds.FIRST_SUBMISSION, ChartIds.WIP, ChartIds.FCII, ChartIds.QMC, ChartIds.HOT1Q, ChartIds.OP];
      service.setWorkloadChecks(checks);
      expect(service.workloadChecks()).toEqual(resultChecks);
    });

    it('should set none of the optional workload checks when they doesnt exist', () => {
      const checks = [] as ChartIds[];
      service.setWorkloadChecks(checks);
      expect(service.workloadChecks()).toEqual([]);
    });
  });
});
