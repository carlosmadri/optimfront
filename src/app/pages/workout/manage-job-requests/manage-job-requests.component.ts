import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutTeamOutlookComponent } from '../components/workout-team-outlook/workout-team-outlook.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobRequestDialogComponent } from '../dialogs/job-request-dialog/job-request-dialog.component';
import { ManageTableComponent } from '@tables/manage-table/manage-table.component';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { ManageJobRequestsTableComponent } from '@tables/manage-job-requests-table/manage-job-requests-table.component';
import { NgClass } from '@angular/common';
import { JobRequest } from '@src/app/shared/models/job-request.model';
import { DialogService } from '@src/app/services/dialog-service/dialog.service';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';
import { JobRequestFiltersComponent } from '@components/job-request-filters/job-request-filters.component';
import { EmployeeFiltersComponent } from '@components/employee-filters/employee-filters.component';

const DIALOG_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '80%',
  height: '95%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

@Component({
  selector: 'optim-manage-job-requests',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ManageJobRequestsTableComponent,
    MatButtonModule,
    WorkoutTeamOutlookComponent,
    MatButtonModule,
    ManageTableComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    NgClass,
    JobRequestFiltersComponent,
    EmployeeFiltersComponent,
  ],
  templateUrl: './manage-job-requests.component.html',
  styleUrl: './manage-job-requests.component.scss',
})
export class ManageJobRequestsComponent {
  readonly jobRequestService = inject(JobRequestService);
  readonly dialog = inject(MatDialog);
  readonly dialogService = inject(DialogService);
  activeFilters = false;

  toggleActiveFilters(event: boolean) {
    this.activeFilters = event;
  }

  refreshTable = signal<JobRequest | undefined>(undefined);

  addJR() {
    const dialogRef = this.dialog.open(JobRequestDialogComponent, DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((response: { jobRequest?: JobRequest; delete: boolean }) => {
      if (response && response.jobRequest && !response.delete) {
        this.refreshTable.set(response.jobRequest);
      }
    });
  }

  editJobRequest(jobRequest: JobRequest) {
    const dialogRef = this.dialog.open(JobRequestDialogComponent, { ...DIALOG_CONFIG, data: jobRequest });

    dialogRef.afterClosed().subscribe((response: { jobRequest?: JobRequest; delete: boolean }) => {
      if (response && response.jobRequest && !response.delete) {
        this.refreshTable.set(response.jobRequest);
      } else if (response && response.jobRequest && response.delete) {
        this.deleteJobRequest(response.jobRequest);
      }
    });
  }

  async deleteJobRequest(jobRequest: JobRequest) {
    const result = await this.dialogService.openConfirmationDialog(`Delete confirmation`, `Are you sure you want to delete this Job Request? ${jobRequest.id}`);
    if (!result) {
      return;
    }
    try {
      await this.jobRequestService.deleteJobRequest(jobRequest.id.toString());
      this.refreshTable.set(jobRequest);
    } catch (error) {
      this.dialogService.openMessageDialog('Error', 'Error deleting job request', 'error');
      console.error('Error deleting job request:', error);
    }
  }
}
