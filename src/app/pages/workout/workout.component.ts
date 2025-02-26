import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WorkoutLeversEoyComponent } from './components/workout-levers-eoy/workout-levers-eoy.component';
import { WorkoutIndirectRatioComponent } from './components/workout-indirect-ratio/workout-indirect-ratio.component';
import { WorkoutNawfBreakdownComponent } from './components/workout-nawf-breakdown/workout-nawf-breakdown.component';
import { WorkoutJrBreakdownComponent } from './components/workout-jr-breakdown/workout-jr-breakdown.component';
import { RouterLinkWithHref } from '@angular/router';
import { WorkoutFteLocationComponent } from './components/workout-fte-location/workout-fte-location.component';
import { WorkoutTeamOutlookComponent } from './components/workout-team-outlook/workout-team-outlook.component';
import { WorkoutMonthlyDistributionComponent } from './components/workout-monthly-distribution/workout-monthly-distribution.component';
import { WorkoutBorrowedLeasedComponent } from './components/workout-borrowed-leased/workout-borrowed-leased.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './dialogs/employee-dialog/employee-dialog.component';
import { ChartSelectorComponent } from '@src/app/shared/components/chart-selector/chart-selector.component';

const DIALOG_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '80%',
  height: '95%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

@Component({
  selector: 'optim-workout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    WorkoutLeversEoyComponent,
    WorkoutIndirectRatioComponent,
    WorkoutNawfBreakdownComponent,
    WorkoutJrBreakdownComponent,
    WorkoutFteLocationComponent,
    WorkoutTeamOutlookComponent,
    WorkoutMonthlyDistributionComponent,
    WorkoutBorrowedLeasedComponent,
    ChartSelectorComponent,
    RouterLinkWithHref,
    MatDialogModule,
  ],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss',
})
export class WorkoutComponent {
  readonly dialog = inject(MatDialog);

  openEmployeeDialog() {
    this.dialog.open(EmployeeDialogComponent, DIALOG_CONFIG);
  }
}
