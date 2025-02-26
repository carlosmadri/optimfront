import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutEmployeeTableComponent } from './workout-employee-table.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { signal, WritableSignal } from '@angular/core';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { Employee } from '@src/app/shared/models/employee.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ManageLeversService } from '@src/app/services/levers/manage-levers.service';

describe('WorkoutEmployeeTableComponent', () => {
  let component: WorkoutEmployeeTableComponent;
  let mockEmployeeService: Partial<EmployeeService>;
  let mockEmployees: WritableSignal<Employee[]>;
  let mockTotalEmployees: WritableSignal<number>;
  let mockManageLeversService: Partial<ManageLeversService>;
  let fixture: ComponentFixture<WorkoutEmployeeTableComponent>;

  beforeEach(async () => {
    mockTotalEmployees = signal<number>(0);
    mockEmployees = signal<Employee[]>([]);

    mockEmployeeService = {
      employees: mockEmployees,
      totalEmployees: mockTotalEmployees,
      getEmployees: jest.fn().mockResolvedValue(null),
    };

    mockManageLeversService = {
      openLeverDialog: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        WorkoutEmployeeTableComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NgClass,
        NoopAnimationsModule,
      ],
      providers: [DatePipe, { provide: EmployeeService, useValue: mockEmployeeService }, { provide: ManageLeversService, useValue: mockManageLeversService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
