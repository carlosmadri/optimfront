import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadWorkforceComponent } from './workload-workforce.component';
import { BarChartComponent } from '@src/app/shared/graphs/bar-chart/bar-chart.component';
import { MockBarChartComponent } from '@src/app/mocks/components/bar-chart-mock.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { signal } from '@angular/core';
import { WorkloadWorkforce } from '@src/app/shared/models/worksync.model';
import { WorkloadWorkforceAdapter } from '@src/app/shared/adapters/workload-workforce/workload-workforce.adapter';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';

describe('WorkloadWorkforceComponent', () => {
  let component: WorkloadWorkforceComponent;
  let fixture: ComponentFixture<WorkloadWorkforceComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  beforeEach(async () => {
    mockWorksyncService = {
      workloadWorkforce: signal<WorkloadWorkforce[]>([]),
      getWorkLoadWorkforce: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    TestBed.overrideComponent(WorkloadWorkforceComponent, {
      remove: {
        imports: [BarChartComponent],
      },
      add: {
        imports: [MockBarChartComponent],
      },
    });
    await TestBed.configureTestingModule({
      imports: [WorkloadWorkforceComponent, MockBarChartComponent],
      providers: [
        ChartSelectorService,
        WorkloadWorkforceAdapter,
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadWorkforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
