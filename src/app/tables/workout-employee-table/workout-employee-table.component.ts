import { DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild, computed, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { ManageLeversService } from '@src/app/services/levers/manage-levers.service';
import { FilterNameComponent } from '@src/app/shared/components/filter-name/filter-name.component';
import { Employee } from '@src/app/shared/models/employee.model';
import { impersonalLeverTypes, personalLeverTypes } from '@src/app/shared/models/lever.model';
import { merge } from 'rxjs';

export interface EmployeeWithLeversTable {
  id: number;
  firstName: string;
  leverId: number;
  leverType: string;
  startDate: string;
  endDate: string;
  fte: number;
  hasMoreLever: boolean;
}
const FILTERS_WITH_LEVERS_PARAM = 'hasLevers=true';

@Component({
  selector: 'optim-workout-employee-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule, FilterNameComponent, NgClass],
  providers: [DatePipe],
  templateUrl: './workout-employee-table.component.html',
  styleUrl: './workout-employee-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutEmployeeTableComponent implements OnInit, AfterViewInit {
  private employeeService = inject(EmployeeService);
  private datePipe = inject(DatePipe);
  readonly dialog = inject(MatDialog);
  private manageLeversService = inject(ManageLeversService);

  pageSizeOptions = [5, 10, 20, 50, 100];
  defaultPageSize = this.pageSizeOptions[1];

  columnsToDisplay: string[] = ['Name', 'Lever', 'Start Date', 'End Date', 'FTE', 'Actions'];
  elementKeys: string[] = ['firstName', 'leverType', 'startDate', 'endDate', 'fte', 'actions'];

  employees = this.employeeService.employees;
  totalEmployees = this.employeeService.totalEmployees;

  sortByName = 'firstName,lastName,levers.startDate';
  sortById = 'id,levers.startDate';

  lastEmployeeId: number | null = null;

  tableDataSource = new MatTableDataSource<EmployeeWithLeversTable>();

  firstName: string | undefined;
  lastName: string | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = computed(() => {
    if (this.employees()?.length > 0) {
      return this.formatTableData(this.employees());
    }
    return;
  });

  ngOnInit() {
    this.updateTable();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.updateTable();
    });
  }

  private getSortParams() {
    const sortDirection = this.sort?.direction || '';
    const sortActive = sortDirection ? this.sortByName : this.sortById;
    return [`sort=${sortActive},${sortDirection}`, `page=${this.paginator?.pageIndex || 0}`, `size=${this.paginator?.pageSize || this.defaultPageSize}`];
  }

  updateTable() {
    const sortParams = this.getSortParams();
    const filterParams = [
      FILTERS_WITH_LEVERS_PARAM,
      this.firstName ? `employee.firstName=${this.firstName}` : '',
      this.lastName ? `employee.lastName=${this.lastName}` : '',
    ].filter((item) => item);

    this.employeeService.getEmployees([...filterParams, ...sortParams]).catch((err) => console.error(err));
  }

  filterByName(filters: { firstName: string | null; lastName: string | null }) {
    this.firstName = filters.firstName?.trim();
    this.lastName = filters.lastName?.trim();

    this.paginator.firstPage();
    this.updateTable();
  }

  private formatTableData(employees: Employee[]): MatTableDataSource<EmployeeWithLeversTable> {
    this.lastEmployeeId = null;
    const tableData: EmployeeWithLeversTable[] = employees.flatMap((employee): EmployeeWithLeversTable[] => {
      return employee.levers.map((lever, index): EmployeeWithLeversTable => {
        const tableRow = {
          id: employee.id,
          firstName: this.lastEmployeeId !== employee.id ? `${employee.firstName} ${employee.lastName}` : '',
          leverId: lever.id,
          leverType: lever.leverType,
          startDate: this.datePipe.transform(lever.startDate, 'dd/MM/yyyy') || '',
          endDate: this.datePipe.transform(lever.endDate, 'dd/MM/yyyy') || '',
          fte: lever.fte | 0,
          hasMoreLever: employee.levers.length > index + 1,
        };
        this.lastEmployeeId = employee.id;
        return tableRow;
      });
    });
    return new MatTableDataSource<EmployeeWithLeversTable>(tableData);
  }

  onEditClick(employeeId: number, leverId: number) {
    const el = this.employees().find((e) => e.id === employeeId)!;
    const lever = el.levers.find((l) => l.id === leverId);
    const types = el.impersonal ? impersonalLeverTypes : personalLeverTypes;
    this.manageLeversService
      .openLeverDialog(types, el.fte, el.id, lever)
      .then(() => this.updateTable())
      .catch((err: unknown) => console.error(err));
  }
}
