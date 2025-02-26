import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeFiltersComponent } from '@components/employee-filters/employee-filters.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgClass } from '@angular/common';
import { ManageTableComponent } from '@tables/manage-table/manage-table.component';
import { WorkoutTeamOutlookComponent } from '@pages/workout/components/workout-team-outlook/workout-team-outlook.component';
import { impersonalLeverTypes } from '@models/lever.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../dialogs/employee-dialog/employee-dialog.component';
import { ManageLeversService } from '@src/app/services/levers/manage-levers.service';

const DIALOG_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '80%',
  height: '95%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

@Component({
  selector: 'optim-manage-teams',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    ManageTableComponent,
    EmployeeFiltersComponent,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    NgClass,
    WorkoutTeamOutlookComponent,
    EmployeeDialogComponent,
  ],
  templateUrl: './manage-teams.component.html',
  styleUrl: './manage-teams.component.scss',
})
export class ManageTeamsComponent {
  readonly dialog = inject(MatDialog);
  private manageLeversService = inject(ManageLeversService);

  @ViewChild(ManageTableComponent) child!: ManageTableComponent;
  activeFilters = false;

  toggleActiveFilters(event: boolean) {
    this.activeFilters = event;
  }

  onAddLever() {
    this.manageLeversService.openLeverDialog(impersonalLeverTypes);
  }

  openLeversDialog() {
    this.dialog.open(EmployeeDialogComponent, DIALOG_CONFIG);
  }
}
