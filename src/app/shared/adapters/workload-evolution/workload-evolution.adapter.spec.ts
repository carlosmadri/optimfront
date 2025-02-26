import { TestBed } from '@angular/core/testing';

import { WorkloadEvolutionAdapter } from './workload-evolution.adapter';
import {
  ChartIds,
  WorkloadEvolution,
  WorkloadEvolutionAPI,
  WorkloadEvolutionBarType,
  WorkloadEvolutionStatusAPI,
  WorkloadSubmissionStatus,
} from '../../models/worksync.model';

describe('WorkloadEvolutionAdapter', () => {
  let service: WorkloadEvolutionAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkloadEvolutionAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array if data is empty', () => {
    const result = service.adapt(null);
    expect(result).toEqual(null);
  });

  it('should correctly adapt data', () => {
    const input: WorkloadEvolutionAPI = {
      workloadEvolutionList: [
        {
          exercise: 'OP24',
          khrsOwnDirect: 1,
          khrsOwnIndirect: 2,
          khrsSubDirect: 3,
          khrsSubIndirect: 4.18,
        },
        {
          exercise: 'First Submission',
          khrsOwnDirect: 1,
          khrsOwnIndirect: 2,
          khrsSubDirect: 3,
          khrsSubIndirect: 4.18,
        },
        {
          exercise: 'QMC',
          khrsOwnDirect: 5,
          khrsOwnIndirect: 6,
          khrsSubDirect: 7,
          khrsSubIndirect: 8,
        },
      ],
      lastStatus: WorkloadEvolutionStatusAPI.OPENED,
      multipleSiglums: false,
    };

    const expected: WorkloadEvolution = {
      data: [
        {
          exercise: 'OP24',
          id: ChartIds.OP,
          barType: WorkloadEvolutionBarType.OP,
          ownDirect: 1,
          ownIndirect: 2,
          subDirect: 3,
          subIndirect: 4.2,
          total: 10.2,
        },
        {
          exercise: 'First Submission',
          id: ChartIds.FIRST_SUBMISSION,
          barType: WorkloadEvolutionBarType.APPROVED,
          ownDirect: 1,
          ownIndirect: 2,
          subDirect: 3,
          subIndirect: 4.2,
          total: 10.2,
        },
        {
          exercise: 'QMC',
          barType: WorkloadEvolutionBarType.WIP,
          id: ChartIds.QMC,
          ownDirect: 5,
          ownIndirect: 6,
          subDirect: 7,
          subIndirect: 8,
          total: 26,
        },
      ],
      multipleSiglums: false,
      submissionStatus: WorkloadSubmissionStatus.SUBMITTED,
      validationStatus: undefined,
    };

    const result = service.adapt(input);
    expect(result).toEqual(expected);
  });
});
