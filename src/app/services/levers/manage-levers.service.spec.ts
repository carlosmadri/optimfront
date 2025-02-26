import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Lever } from '@models/lever.model';
import { LeversService } from '@services/levers/levers.service';
import { EmployeeService } from '@services/employee/employee.service';
import { DialogService } from '@services/dialog-service/dialog.service';
import { FiltersService } from '@services/filters/filters.service';
import { ManageLeversService } from './manage-levers.service';
import { of } from 'rxjs';
import { LeversEoyAdapter } from '@src/app/shared/adapters/levers-eoy/levers/levers-eoy.adapter';

describe('ManageLeversService', () => {
  let service: ManageLeversService;

  beforeEach(() => {
    const dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({} as Lever)),
      }),
    };

    const leversServiceSpy = {
      addLever: jest.fn(),
      editLever: jest.fn(),
      deleteLever: jest.fn(),
    };

    const employeeServiceSpy = {
      editEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
      getEmployees: jest.fn().mockReturnValue(of([])),
    };

    const dialogServiceSpy = {
      openMessageDialog: jest.fn(),
      openConfirmationDialog: jest.fn().mockReturnValue(Promise.resolve(true)),
    };

    const filtersServiceSpy = {
      employeeParamsFilter: jest.fn().mockReturnValue({}),
    };

    TestBed.configureTestingModule({
      providers: [
        ManageLeversService,
        LeversEoyAdapter,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LeversService, useValue: leversServiceSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: FiltersService, useValue: filtersServiceSpy },
      ],
    });

    service = TestBed.inject(ManageLeversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
