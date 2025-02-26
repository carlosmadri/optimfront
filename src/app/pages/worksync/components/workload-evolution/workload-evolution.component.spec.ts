import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { WorkloadEvolutionComponent } from './workload-evolution.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { signal, WritableSignal } from '@angular/core';
import { ChartIds, WorkloadEvolution, WorkloadEvolutionBarType, WorkloadSubmissionStatus } from '@src/app/shared/models/worksync.model';
import { MockMultibarChartComponent } from '@src/app/mocks/components/multibar-chart-mock.component';
import { MultibarChartComponent } from '@src/app/shared/graphs/multibar-chart/multibar-chart.component';
import { WorkloadEvolutionAdapter } from '@src/app/shared/adapters/workload-evolution/workload-evolution.adapter';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';

describe('WorkloadEvolutionComponent', () => {
  let component: WorkloadEvolutionComponent;
  let fixture: ComponentFixture<WorkloadEvolutionComponent>;
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

    TestBed.overrideComponent(WorkloadEvolutionComponent, {
      remove: {
        imports: [MultibarChartComponent],
      },
      add: {
        imports: [MockMultibarChartComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkloadEvolutionComponent, MockMultibarChartComponent],
      providers: [
        WorkloadEvolutionAdapter,
        ChartSelectorService,
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter workload evolution lines based on evolutionData and selectedChecks', inject(
    [ChartSelectorService],
    (chartSelectorService: ChartSelectorService) => {
      chartSelectorService.setSelectedChecks([ChartIds.OP, ChartIds.FCII, ChartIds.QMC]);

      const result = component.lineChartFiltered();

      expect(result).toEqual(initialEvolution.data.reverse());
    },
  ));

  it('should return an empty array no checks are selected', inject([ChartSelectorService], (chartSelectorService: ChartSelectorService) => {
    chartSelectorService.setSelectedChecks([]);

    const result = component.lineChartFiltered();

    expect(result).toEqual([]);
  }));
});
