import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutIndirectRatioComponent } from './workout-indirect-ratio.component';
import { EmployeeService } from '@app/services/employee/employee.service';
import { FiltersService } from '@app/services/filters/filters.service';
import { DirectIndirect } from '@app/shared/models/employee.model';
import { signal, WritableSignal } from '@angular/core';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';

describe('WorkoutIndirectRatioComponent', () => {
  let component: WorkoutIndirectRatioComponent;
  let fixture: ComponentFixture<WorkoutIndirectRatioComponent>;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockWorksync: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  const initialDirectIndirect: DirectIndirect = { direct: 100, indirect: 50 };

  beforeEach(async () => {
    mockEmployeeService = {
      directRatio: signal<DirectIndirect>(initialDirectIndirect),
      getDirectRatio: jest.fn(),
    };

    mockWorksync = {
      directRatio: signal<DirectIndirect>(initialDirectIndirect),
      getDirectRatio: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutIndirectRatioComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: WorksyncService, useValue: mockWorksync },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutIndirectRatioComponent);
    fixture.componentRef.setInput('serviceType', 'employee');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);
    (mockEmployeeService.directRatio as WritableSignal<DirectIndirect>).set(initialDirectIndirect);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDirectRatio when paramsFilter changes', () => {
    const newParams = ['param1=value1', 'param2=value2'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(newParams);

    fixture.detectChanges();

    expect(mockEmployeeService.getDirectRatio).toHaveBeenCalledWith(newParams);
  });

  it('should call loadData on initialization', () => {
    expect(mockEmployeeService.getDirectRatio).toHaveBeenCalledWith([]);
    expect(component.directData()).toBe(100);
    expect(component.indirectData()).toBe(50);
    expect(component.total()).toBe(33.3);
  });

  it('should call loadData on paramsFilter changes', () => {
    const newParams = ['param1=value1', 'param2=value2'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(newParams);

    fixture.detectChanges();

    expect(mockEmployeeService.getDirectRatio).toHaveBeenCalledWith(['param1=value1', 'param2=value2']);
  });

  it('should calculate total ratio correctly', async () => {
    await component.loadData([]);

    expect(component.directData()).toBe(100);
    expect(component.indirectData()).toBe(50);
    expect(component.total()).toBe(33.3);
  });

  it('should calculate the ratio when the direct data is a 100%', async () => {
    (mockEmployeeService.directRatio as WritableSignal<DirectIndirect>).set({ direct: 5, indirect: 0 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData();

    expect(component.directData()).toBe(5);
    expect(component.indirectData()).toBe(0);
    expect(component.total()).toBe(0);
  });

  it('should calculate the ratio when the indirect data is a 100%', async () => {
    (mockEmployeeService.directRatio as WritableSignal<DirectIndirect>).set({ direct: 0, indirect: 5 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData();

    expect(component.directData()).toBe(0);
    expect(component.indirectData()).toBe(5);
    expect(component.total()).toBe(100);
  });

  it('should update data when filter change', async () => {
    (mockEmployeeService.directRatio as WritableSignal<DirectIndirect>).set({ direct: 30, indirect: 70 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData(['param1=value1']);

    expect(component.directData()).toBe(30);
    expect(component.indirectData()).toBe(70);
    expect(component.total()).toBe((70 / (30 + 70)) * 100);
  });

  it('should update data when filter change for value 0', async () => {
    (mockEmployeeService.directRatio as WritableSignal<DirectIndirect>).set({ direct: 0, indirect: 0 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData(['param1=value1']);

    expect(component.directData()).toBe(0);
    expect(component.indirectData()).toBe(0);
    expect(component.total()).toBe(0);
  });
});
