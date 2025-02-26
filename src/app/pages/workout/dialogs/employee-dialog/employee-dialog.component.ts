import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterLinkWithHref } from '@angular/router';
import { WorkoutEmployeeTableComponent } from '@src/app/tables/workout-employee-table/workout-employee-table.component';

@Component({
  selector: 'optim-employee-dialog',
  standalone: true,
  imports: [MatDialogClose, MatDialogContent, WorkoutEmployeeTableComponent, MatButton, MatIcon, MatIconButton, RouterLinkWithHref],
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDialogComponent {}
