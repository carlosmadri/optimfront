import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDialogComponent } from './employee-dialog.component';
import { MockWorkoutEmployeeTableComponent } from '@src/app/mocks/components/workout-employee-table-mock.component';
import { WorkoutEmployeeTableComponent } from '@src/app/tables/workout-employee-table/workout-employee-table.component';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

describe('EmployeeDialogComponent', () => {
  let component: EmployeeDialogComponent;
  let fixture: ComponentFixture<EmployeeDialogComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(EmployeeDialogComponent, {
      remove: {
        imports: [WorkoutEmployeeTableComponent],
      },
      add: {
        imports: [MockWorkoutEmployeeTableComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        EmployeeDialogComponent,
        MockWorkoutEmployeeTableComponent,
        MatDialogClose,
        MatDialogContent,
        WorkoutEmployeeTableComponent,
        MatButton,
        MatIcon,
        MatIconButton,
        RouterLinkWithHref,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'some-id',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
