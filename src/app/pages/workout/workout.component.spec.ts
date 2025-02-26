import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutComponent } from './workout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkoutFteLocationComponent } from './components/workout-fte-location/workout-fte-location.component';
import { WorkoutLeversEoyComponent } from './components/workout-levers-eoy/workout-levers-eoy.component';
import {
  MockWorkoutFteLocationComponent,
  MockWorkoutLeversEoyComponent,
  MockWorkoutTeamOutlookComponent,
  MockWorkoutIndirectRatioComponent,
  MockWorkoutNawfBreakdownComponent,
  MockWorkoutJrBreakdownComponent,
  MockWorkoutMonthlyDistributionComponent,
  MockWorkoutBorrowedLeasedComponent,
  MockWorkoutEmployeeDialogComponent,
} from '@app/mocks/components';
import { WorkoutTeamOutlookComponent } from './components/workout-team-outlook/workout-team-outlook.component';
import { WorkoutIndirectRatioComponent } from './components/workout-indirect-ratio/workout-indirect-ratio.component';
import { WorkoutNawfBreakdownComponent } from './components/workout-nawf-breakdown/workout-nawf-breakdown.component';
import { WorkoutJrBreakdownComponent } from './components/workout-jr-breakdown/workout-jr-breakdown.component';
import { WorkoutMonthlyDistributionComponent } from './components/workout-monthly-distribution/workout-monthly-distribution.component';
import { WorkoutBorrowedLeasedComponent } from './components/workout-borrowed-leased/workout-borrowed-leased.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './dialogs/employee-dialog/employee-dialog.component';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(WorkoutComponent, {
      remove: {
        imports: [
          WorkoutFteLocationComponent,
          WorkoutLeversEoyComponent,
          WorkoutTeamOutlookComponent,
          WorkoutIndirectRatioComponent,
          WorkoutNawfBreakdownComponent,
          WorkoutJrBreakdownComponent,
          WorkoutMonthlyDistributionComponent,
          WorkoutBorrowedLeasedComponent,
          EmployeeDialogComponent,
        ],
      },
      add: {
        imports: [
          MockWorkoutFteLocationComponent,
          MockWorkoutLeversEoyComponent,
          MockWorkoutTeamOutlookComponent,
          MockWorkoutIndirectRatioComponent,
          MockWorkoutNawfBreakdownComponent,
          MockWorkoutJrBreakdownComponent,
          MockWorkoutMonthlyDistributionComponent,
          MockWorkoutBorrowedLeasedComponent,
          MockWorkoutEmployeeDialogComponent,
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MockWorkoutFteLocationComponent,
        MockWorkoutLeversEoyComponent,
        MockWorkoutTeamOutlookComponent,
        MockWorkoutIndirectRatioComponent,
        MockWorkoutNawfBreakdownComponent,
        MockWorkoutJrBreakdownComponent,
        MockWorkoutMonthlyDistributionComponent,
        MockWorkoutBorrowedLeasedComponent,
        MockWorkoutEmployeeDialogComponent,
        MatDialogModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
