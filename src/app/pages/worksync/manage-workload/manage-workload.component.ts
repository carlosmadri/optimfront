import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeFiltersComponent } from '@components/employee-filters/employee-filters.component';
import { ManageTableComponent } from '@tables/manage-table/manage-table.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgClass } from '@angular/common';
import { WorkoutTeamOutlookComponent } from '@pages/workout/components/workout-team-outlook/workout-team-outlook.component';
import { ManageWorkloadTableComponent } from '@tables/manage-workload-table/manage-workload-table.component';
import { WorkloadPreviewComponent } from '../components/workload-preview/workload-preview.component';
import { WorkloadStatusComponent } from '../components/workload-status/workload-status.component';
import { WorkloadSubmissionComponent } from '../components/workload-submission/workload-submission.component';

@Component({
  selector: 'optim-manage-workload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    WorkloadStatusComponent,
    WorkloadSubmissionComponent,
    WorkloadPreviewComponent,
    ManageTableComponent,
    EmployeeFiltersComponent,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    NgClass,
    WorkoutTeamOutlookComponent,
    ManageWorkloadTableComponent,
  ],
  templateUrl: './manage-workload.component.html',
  styleUrl: './manage-workload.component.scss',
})
export class ManageWorkloadComponent {
  activeFilters = false;
  @ViewChild(ManageWorkloadTableComponent) tableComponent!: ManageWorkloadTableComponent;

  toggleActiveFilters(event: boolean) {
    this.activeFilters = event;
  }

  addWorkload() {
    this.tableComponent.addEmptyWorkload();
  }
}
