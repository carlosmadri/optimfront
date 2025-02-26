import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutMonthlyDistributionComponent } from './workout-monthly-distribution.component';
import { MockLineChartComponent } from '@src/app/mocks/components';
import { LineChartComponent } from '@src/app/shared/graphs/line-chart/line-chart.component';
import { NO_ERRORS_SCHEMA, signal, WritableSignal } from '@angular/core';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonthlyDistributionAdapter } from '@src/app/shared/adapters/monthly-distribution/monthly-distribution.adapter';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { ChartIds } from '@src/app/shared/models/worksync.model';

describe('WorkoutMonthlyDistributionComponent', () => {
  let component: WorkoutMonthlyDistributionComponent;
  let fixture: ComponentFixture<WorkoutMonthlyDistributionComponent>;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockFiltersService: Partial<FiltersService>;
  let mockChartSelectorService: Partial<ChartSelectorService>;
  let mockLineChartData: WritableSignal<LineChartData | null>;
  let mockParamsFilter: WritableSignal<string[]>;
  let mockSelectedChecks: WritableSignal<ChartIds[]>;
  let monthlyAdapterMock: jest.Mocked<MonthlyDistributionAdapter>;

  beforeEach(async () => {
    monthlyAdapterMock = {
      filterMonthlyDistributionLines: jest.fn(),
    } as unknown as jest.Mocked<MonthlyDistributionAdapter>;
    mockLineChartData = signal<LineChartData | null>(null);
    mockParamsFilter = signal<string[]>([]);
    mockSelectedChecks = signal<ChartIds[]>([]);

    mockEmployeeService = {
      monthlyData: mockLineChartData,
      getMonthlyDistribution: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: mockParamsFilter,
    };

    mockChartSelectorService = {
      selectedChecks: mockSelectedChecks,
    };

    TestBed.overrideComponent(WorkoutMonthlyDistributionComponent, {
      remove: {
        imports: [LineChartComponent],
      },
      add: {
        imports: [MockLineChartComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkoutMonthlyDistributionComponent, ReactiveFormsModule, MatCheckboxModule, LineChartComponent],
      providers: [
        FormBuilder,
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: FiltersService, useValue: mockFiltersService },
        { provide: MonthlyDistributionAdapter, useValue: monthlyAdapterMock },
        { provide: ChartSelectorService, useValue: mockChartSelectorService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutMonthlyDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockParamsFilter.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMonthlyDistribution on initialization', () => {
    expect(mockEmployeeService.getMonthlyDistribution).toHaveBeenCalledWith([]);
  });

  it('should react to changes in paramsFilter', () => {
    mockParamsFilter.set(['param1', 'param2']);

    fixture.detectChanges();

    expect(mockEmployeeService.getMonthlyDistribution).toHaveBeenCalledWith(['param1', 'param2']);
  });

  describe('lineChartFiltered', () => {
    const mockData: LineChartData = {
      month: ['Jan', 'Feb', 'Mar'],
      values: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      colors: ['#4e79a7', '#f28e2c', '#e15759'],
      labels: [ChartIds.WIP, ChartIds.FCII, ChartIds.OP],
      showAvg: [true, true, true],
    };
    it('should return null when lineChartData is null', () => {
      mockLineChartData.set(null);

      fixture.detectChanges();

      expect(component.lineChartFiltered()).toBeNull();
    });

    it('should request chart data based on charSelectorService changes', () => {
      mockSelectedChecks.set([ChartIds.OP, ChartIds.WIP]);
      const filterSpy = jest.spyOn(monthlyAdapterMock, 'filterMonthlyDistributionLines').mockReturnValue(mockData);

      mockLineChartData.set(mockData);
      fixture.detectChanges();

      expect(filterSpy).toHaveBeenCalledWith(mockData, [ChartIds.OP, ChartIds.WIP]);
    });
  });
});
