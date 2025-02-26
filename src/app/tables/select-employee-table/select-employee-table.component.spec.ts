import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEmployeeTableComponent } from './select-employee-table.component';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { Employee } from '@src/app/shared/models/employee.model';
import { signal, WritableSignal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectEmployeeTableComponent', () => {
  let component: SelectEmployeeTableComponent;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockEmployees: WritableSignal<Employee[]>;
  let mockTotalEmployees: WritableSignal<number>;
  let fixture: ComponentFixture<SelectEmployeeTableComponent>;

  beforeEach(async () => {
    mockTotalEmployees = signal<number>(0);
    mockEmployees = signal<Employee[]>([]);

    mockEmployeeService = {
      employees: mockEmployees,
      totalEmployees: mockTotalEmployees,
      getEmployees: jest.fn().mockResolvedValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [SelectEmployeeTableComponent, NoopAnimationsModule],
      providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
