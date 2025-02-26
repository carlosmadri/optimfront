import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DIRECT_INDIRECT_VALUES, Employee } from '@models/employee.model';
import { impersonalLeverTypes, Lever, personalLeverTypes } from '@models/lever.model';
import { EmployeeService } from '@services/employee/employee.service';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FiltersService } from '@services/filters/filters.service';
import { RoleProtectedDirective } from '@app/shared/directives/role-protected/role-protected.directive';
import { MatDialog } from '@angular/material/dialog';
import { SIGLUM_TYPES } from '@models/siglum.model';
import { apiParams } from '@models/filters.model';
import { LOCATION_TYPES } from '@models/location.model';
import { ManageLeversService } from '@src/app/services/levers/manage-levers.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

export interface EmployeeTable {
  id: number;
  siglumHR?: string;
  firstName: string;
  country?: string;
  site?: string;
  direct: DIRECT_INDIRECT_VALUES;
  costCenter: string;
  activeWorkforce: string;
  availabilityReason: string;
  contractType: string;
  job: string;
  WCBC: string;
  fte: number;
  levers: Lever[];
  impersonal: boolean;
}

@Component({
  selector: 'optim-manage-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatSortModule, CommonModule, RoleProtectedDirective],
  templateUrl: './manage-table.component.html',
  styleUrl: './manage-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageTableComponent implements AfterViewInit {
  private filterService = inject(FiltersService);
  private employeeService = inject(EmployeeService);
  private manageLeversService = inject(ManageLeversService);
  readonly dialog = inject(MatDialog);
  employees: Employee[] = [];
  addButton = output();
  totalEmployees = 0;
  columnsToDisplay: string[] = [
    'Siglum HR',
    'Name',
    'Country',
    'Site',
    'Direct',
    'Cost Center',
    'Active Workforce',
    'Availability Reason',
    'Contract Type',
    'Job',
    'WC/BC',
    'FTE',
  ];
  elementKeys: string[] = [
    'siglumHR',
    'firstName',
    'country',
    'site',
    'direct',
    'costCenter',
    'activeWorkforce',
    'availabilityReason',
    'contractType',
    'job',
    'WCBC',
    'fte',
  ];
  columnsToDisplayWithExpand = ['expand'];
  expandedElement!: Employee | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = computed(() => {
    this.employees = this.employeeService.employees();
    this.totalEmployees = this.employeeService.totalEmployees();
    if (this.employees?.length > 0) {
      return this.formatTableData(this.employees);
    }
    return;
  });

  constructor() {
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    effect(() => {
      this.paginator.pageIndex = 0;
      this.updateTable(this.filterService.employeeParamsFilter());
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.updateTable(this.filterService.employeeParamsFilter());
    });
  }

  calculateEmployeesFTE() {
    this.employees.forEach((employee) => {
      if (!employee.impersonal && employee.levers?.length > 0) {
        employee.fte =
          employee.fte +
          employee.levers.reduce((fte, lever) => {
            if (lever.endDate && moment().isBetween(moment(lever.startDate), moment(lever.endDate))) {
              return lever.fte + fte;
            } else if (!lever.endDate && moment().isSameOrAfter(moment(lever.startDate))) {
              return lever.fte + fte;
            }
            return fte;
          }, 0);
      }
    });
  }

  private getSortParams() {
    let sortActive = this.sort.active;
    if (!this.sort.active || this.sort.direction === '') {
      sortActive = 'id';
      this.sort.active = 'id';
    } else {
      switch (this.sort.active) {
        case SIGLUM_TYPES.SIGLUMHR:
          sortActive = apiParams[SIGLUM_TYPES.SIGLUMHR];
          break;
        case LOCATION_TYPES.COUNTRY:
          sortActive = apiParams[LOCATION_TYPES.COUNTRY];
          break;
        case LOCATION_TYPES.SITE:
          sortActive = apiParams[LOCATION_TYPES.SITE];
          break;
        default:
          break;
      }
    }
    return [`sort=${sortActive},${this.sort.direction ?? ''}`, `page=${this.paginator.pageIndex}`, `size=${this.paginator.pageSize}`];
  }

  updateTable(filterParams: string[] = []) {
    const sortParams = this.getSortParams();
    this.employeeService.getEmployees([...sortParams, ...filterParams]).catch((err) => console.error(err));
  }

  private formatTableData(employees: Employee[]): MatTableDataSource<EmployeeTable> {
    const tableData: EmployeeTable[] = employees.map((employee): EmployeeTable => {
      return {
        id: employee.id,
        siglumHR: employee.siglum?.siglumHR,
        firstName: `${employee.firstName} ${employee.lastName ?? ''}`,
        country: employee.costCenter?.location?.country,
        site: employee.costCenter?.location?.site,
        direct: employee.direct,
        costCenter: employee.costCenter?.costCenterCode ?? '',
        activeWorkforce: employee.activeWorkforce,
        availabilityReason: employee.availabilityReason,
        contractType: employee.contractType,
        job: employee.job,
        WCBC: employee.collar,
        fte: employee.fte,
        levers: employee.levers,
        impersonal: employee.impersonal,
      };
    });
    return new MatTableDataSource<EmployeeTable>(tableData);
  }

  onAddButton(event: MouseEvent, el: EmployeeTable) {
    event.stopPropagation();
    this.manageLeversService
      .openLeverDialog(personalLeverTypes, el.fte, el.id)
      .then(() => this.updateTable(this.filterService.employeeParamsFilter()))
      .catch((err: unknown) => console.error(err));
  }

  onEditButton(lever: Lever, el: EmployeeTable) {
    const types = el.impersonal ? impersonalLeverTypes : personalLeverTypes;
    this.manageLeversService
      .openLeverDialog(types, el.fte, el.id, lever)
      .then(() => this.updateTable(this.filterService.employeeParamsFilter()))
      .catch((err: unknown) => console.error(err));
  }

  deleteLever(lever: Lever, el: EmployeeTable) {
    this.manageLeversService
      .deleteLever(lever, el.id)
      .then(() => this.updateTable(this.filterService.employeeParamsFilter()))
      .catch((err: unknown) => console.error(err));
  }
}
