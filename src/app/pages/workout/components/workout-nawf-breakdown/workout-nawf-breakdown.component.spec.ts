import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutNawfBreakdownComponent } from './workout-nawf-breakdown.component';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WritableSignal, signal } from '@angular/core';
import { EmployeeSummaryNAWF } from '@app/shared/models/employee.model';

describe('WorkoutNawfBreakdownComponent', () => {
  let component: WorkoutNawfBreakdownComponent;
  let fixture: ComponentFixture<WorkoutNawfBreakdownComponent>;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockFiltersService: Partial<FiltersService>;
  let mockSummaryNAWF: WritableSignal<EmployeeSummaryNAWF[]>;
  let mockParamsFilter: WritableSignal<string[]>;

  beforeEach(async () => {
    mockSummaryNAWF = signal<EmployeeSummaryNAWF[]>([]);
    mockParamsFilter = signal<string[]>([]);

    mockEmployeeService = {
      summaryNAWF: mockSummaryNAWF,
      getSummaryNAWF: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: mockParamsFilter,
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutNawfBreakdownComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutNawfBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData on initialization with params from FiltersService', () => {
    const spy = jest.spyOn(component, 'loadData');
    mockParamsFilter.set(['param1', 'param2']);

    TestBed.flushEffects();

    expect(spy).toHaveBeenCalledWith(['param1', 'param2']);
  });

  it('should call employeeService.getSummaryNAWF in loadData', async () => {
    const params = ['param1', 'param2'];
    await component.loadData(params);
    expect(mockEmployeeService.getSummaryNAWF).toHaveBeenCalledWith(params);
  });

  it('should filter and sort summaryNAWF in sortedSummaryNAWF computed', () => {
    mockSummaryNAWF.set([
      { availabilityReason: 'A', employeeCount: 0 },
      { availabilityReason: 'B', employeeCount: 3 },
      { availabilityReason: 'C', employeeCount: 1 },
      { availabilityReason: 'D', employeeCount: 2 },
    ]);

    const result = component.sortedSummaryNAWF();

    expect(result).toEqual([
      { availabilityReason: 'B', employeeCount: 3 },
      { availabilityReason: 'D', employeeCount: 2 },
      { availabilityReason: 'C', employeeCount: 1 },
      { availabilityReason: 'A', employeeCount: 0 },
    ]);
  });

  it('should handle empty summaryNAWF in sortedSummaryNAWF computed', () => {
    mockSummaryNAWF.set([]);

    const result = component.sortedSummaryNAWF();

    expect(result).toEqual([]);
  });

  it('should update when FiltersService paramsFilter changes', () => {
    const spy = jest.spyOn(component, 'loadData');

    mockParamsFilter.set(['param1']);
    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledWith(['param1']);

    mockParamsFilter.set(['param2', 'param3']);
    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledWith(['param2', 'param3']);
  });
});
