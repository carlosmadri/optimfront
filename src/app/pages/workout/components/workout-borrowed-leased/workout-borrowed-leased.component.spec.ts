import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutBorrowedLeasedComponent } from './workout-borrowed-leased.component';
import { MockLineChartComponent } from '@src/app/mocks/components';
import { NO_ERRORS_SCHEMA, signal, WritableSignal } from '@angular/core';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { LineChartComponent } from '@src/app/shared/graphs/line-chart/line-chart.component';
import { BorrowedLeased } from '@src/app/shared/models/borrowed-leased.model';

describe('WorkoutBorrowedLeasedComponent', () => {
  let component: WorkoutBorrowedLeasedComponent;
  let fixture: ComponentFixture<WorkoutBorrowedLeasedComponent>;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockFiltersService: Partial<FiltersService>;
  let mockBorrowedLeasedData: WritableSignal<BorrowedLeased | null>;
  let mockParamsFilter: WritableSignal<string[]>;

  beforeEach(async () => {
    mockBorrowedLeasedData = signal<BorrowedLeased | null>(null);
    mockParamsFilter = signal<string[]>([]);

    mockEmployeeService = {
      borrowedData: mockBorrowedLeasedData,
      getBorrowedLeased: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: mockParamsFilter,
    };

    TestBed.overrideComponent(WorkoutBorrowedLeasedComponent, {
      remove: {
        imports: [LineChartComponent],
      },
      add: {
        imports: [MockLineChartComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkoutBorrowedLeasedComponent, LineChartComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutBorrowedLeasedComponent);
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

  it('should call getBorrowedLeased on initialization', () => {
    expect(mockEmployeeService.getBorrowedLeased).toHaveBeenCalledWith([]);
  });

  it('should react to changes in paramsFilter', () => {
    mockParamsFilter.set(['param1', 'param2']);

    fixture.detectChanges();

    expect(mockEmployeeService.getBorrowedLeased).toHaveBeenCalledWith(['param1', 'param2']);
  });
});
