import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { FilterNameComponent } from '@src/app/shared/components/filter-name/filter-name.component';
import { Employee } from '@src/app/shared/models/employee.model';
import { merge } from 'rxjs';

export interface EmployeeNameTable {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'optim-select-employee-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule, FilterNameComponent],
  templateUrl: './select-employee-table.component.html',
  styleUrl: './select-employee-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectEmployeeTableComponent implements OnInit, AfterViewInit {
  private employeeService = inject(EmployeeService);

  pageSizeOptions = [10, 20, 50, 100];
  defaultPageSize = this.pageSizeOptions[0];

  columnsToDisplay: string[] = ['First Name', 'Last Name', 'Select employee'];
  elementKeys: string[] = ['firstName', 'lastName', 'actions'];

  employees = this.employeeService.employees;
  totalEmployees = this.employeeService.totalEmployees;

  sortByName = 'firstName,lastName';
  sortById = 'id,levers.startDate';

  tableDataSource = new MatTableDataSource<EmployeeNameTable>();

  firstName: string | undefined;
  lastName: string | undefined;

  employeeSelected = output<Employee>();

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
    const filterParams = [this.firstName ? `employee.firstName=${this.firstName}` : '', this.lastName ? `employee.lastName=${this.lastName}` : ''].filter(
      (item) => item,
    );

    this.employeeService.getEmployees([...filterParams, ...sortParams]).catch((err) => console.error(err));
  }

  filterByName(filters: { firstName: string | null; lastName: string | null }) {
    this.firstName = filters.firstName?.trim();
    this.lastName = filters.lastName?.trim();

    this.paginator.firstPage();
    this.updateTable();
  }

  private formatTableData(employees: Employee[]): MatTableDataSource<EmployeeNameTable> {
    const tableData: EmployeeNameTable[] = employees.map((employee) => {
      const tableRow = {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
      };
      return tableRow;
    });
    return new MatTableDataSource<EmployeeNameTable>(tableData);
  }

  onSelect(employeeId: number) {
    const employee: Employee = this.employees().find((emp) => emp.id === employeeId)!;
    this.employeeSelected.emit(employee);
  }
}
