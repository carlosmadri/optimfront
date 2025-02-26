import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadStatusComponent } from './workload-status.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { ChartIds, WorkloadEvolution, WorkloadEvolutionBarType, WorkloadSubmissionStatus } from '@src/app/shared/models/worksync.model';
import { signal } from '@angular/core';
import { FiltersService } from '@src/app/services/filters/filters.service';

describe('WorkloadStatusComponent', () => {
  let component: WorkloadStatusComponent;
  let fixture: ComponentFixture<WorkloadStatusComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  const initialEvolution: WorkloadEvolution = {
    data: [
      {
        exercise: 'OP24',
        id: ChartIds.OP,
        barType: WorkloadEvolutionBarType.OP,
        ownDirect: 3,
        ownIndirect: 7,
        subDirect: 6,
        subIndirect: 4,
        total: 20,
      },
      {
        exercise: 'FCII',
        id: ChartIds.FCII,
        barType: WorkloadEvolutionBarType.FCII,
        ownDirect: 11,
        ownIndirect: 15,
        subDirect: 14,
        subIndirect: 12,
        total: 52,
      },
      {
        exercise: 'QMC',
        id: ChartIds.QMC,
        barType: WorkloadEvolutionBarType.SUBMIT,
        ownDirect: 1,
        ownIndirect: 2,
        subDirect: 3,
        subIndirect: 4,
        total: 10,
      },
    ],
    multipleSiglums: false,
    submissionStatus: WorkloadSubmissionStatus.NOT_SUBMITTED,
    validationStatus: undefined,
  };

  beforeEach(async () => {
    mockWorksyncService = {
      evolution: signal<WorkloadEvolution>(initialEvolution),
      getWorkLoadEvolution: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    await TestBed.configureTestingModule({
      imports: [WorkloadStatusComponent],
      providers: [
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
