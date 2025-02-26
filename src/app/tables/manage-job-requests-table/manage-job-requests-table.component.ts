import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, input, output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { RoleProtectedDirective } from '@app/shared/directives/role-protected/role-protected.directive';
import { JobRequestService } from '@services/job-request/job-request.service';
import { JobRequest } from '@models/job-request.model';
import { merge } from 'rxjs';
import { FiltersService } from '@services/filters/filters.service';
// import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
// const moment = _rollupMoment || _moment;

@Component({
  selector: 'optim-manage-job-requests-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule, CommonModule, RoleProtectedDirective],
  templateUrl: './manage-job-requests-table.component.html',
  styleUrl: './manage-job-requests-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageJobRequestsTableComponent implements AfterViewInit {
  private jobRequestsService = inject(JobRequestService);
  private filterService = inject(FiltersService);
  jobRequests!: JobRequest[];
  totalJobRequests = 0;

  refreshTable = input<JobRequest | undefined>();

  editJobRequest = output<JobRequest>();
  deleteJobRequest = output<JobRequest>();

  displayedColumns: string[] = ['siglumHR', 'workdayNumber', 'description', 'status', 'activeWorkforce', 'startDate', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = computed(() => {
    this.jobRequests = this.jobRequestsService.jobRequests();
    this.totalJobRequests = this.jobRequestsService.totalJobRequests();
    if (this.jobRequests?.length > 0) {
      return this.jobRequests;
    }
    return [];
  });

  constructor() {
    effect(() => {
      this.refreshTable();
      this.paginator.pageIndex = 0;
      this.updateTable(this.filterService.jobRequestParamsFilter());
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.updateTable(this.filterService.jobRequestParamsFilter());
    });
  }

  private getSortParams() {
    let sortActive = this.sort.active;
    if (!this.sort.active || this.sort.direction === '') {
      sortActive = 'id';
      this.sort.active = 'id';
    } else {
      sortActive = this.sort.active;
    }
    return [`sort=${sortActive},${this.sort.direction ?? ''}`, `page=${this.paginator.pageIndex}`, `size=${this.paginator.pageSize}`];
  }

  updateTable(filterParams?: string[]) {
    const sortParams = this.getSortParams();
    this.jobRequestsService.getJobRequests([...sortParams, ...filterParams!]).catch((err) => console.error(err));
  }

  onEditButton(element: JobRequest) {
    this.editJobRequest.emit(element);
  }

  onDeleteButton(element: JobRequest) {
    this.deleteJobRequest.emit(element);
  }
}
