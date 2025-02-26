import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorksyncService } from '@services/worksync/worksync.service';
import { backlogOrderIntakeValues, collarValues, coreNonCoreValues, ownSubValues, Ppsid, Workload } from '@models/worksync.model';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CustomSelect, DynamicInputComponent } from '@components/dynamic-input/dynamic-input.component';
import { FiltersService } from '@services/filters/filters.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { merge } from 'rxjs';
import { directIndirectValues } from '@models/employee.model';
import { CostCenterService } from '@services/cost-center/cost-center.service';
import { CostCenter } from '@models/cost-center.model';
const moment = _rollupMoment || _moment;

export interface WorkloadTable {
  id: number;
  costCenterId?: number;
  siglum: string;
  description: string;
  own: string;
  site?: string; //costCenter.location.site
  costCenter: string;
  direct: string;
  timeline: string;
  khrs: number;
  go: boolean;
  ppsid_id: number; //ppsid table
  ppsid: string;
  ppsidName: string;
  businessLine: string;
  programLine: string;
  productionCenter: string;
  businessActivity: string;
  backlogOrderIntake: string;
  muCode: string;
  muText: string; //ppsid table end
  scenario: string;
  collar: string; //workload.collar
  efficiency?: number; //costCenter.efficiency
  rateOwn?: number; //costCenter.rateOwn
  fte: number; //workload.fte
  keur: number; //workload.keur
  eac: boolean; //workload.eac
  expanded: boolean;
}

@Component({
  selector: 'optim-manage-workload-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    DynamicInputComponent,
    MatSlideToggleModule,
    MatDatepickerModule,
  ],
  templateUrl: './manage-workload-table.component.html',
  styleUrl: './manage-workload-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageWorkloadTableComponent implements AfterViewInit {
  private worksyncService = inject(WorksyncService);
  private filtersService = inject(FiltersService);
  private costCenterService = inject(CostCenterService);
  allCostCenter: CostCenter[] = [];
  allSiglumHR = computed<string[]>(() => this.filtersService.getAllSiglumsHR());
  allSites = computed<CustomSelect[]>(() => {
    return this.allCostCenter.map((cc) => {
      return {
        id: cc.id,
        value: cc.location.site,
        description: cc.costCenterCode,
        label: 'Cost Center',
      };
    });
  });
  allCostCenterCodes = computed<CustomSelect[]>(() => {
    return this.allCostCenter.map((cc) => {
      return {
        id: cc.id,
        value: cc.costCenterCode,
        description: cc.location.site,
        label: 'Site',
      };
    });
  });
  allPpsids = computed<string[]>(() => this.worksyncService.ppsids());
  allOwns = ownSubValues;
  allDirect = directIndirectValues;
  allCores = coreNonCoreValues;
  allCollar = collarValues;
  allBacklogOrderIntake = backlogOrderIntakeValues;
  private workloads: Workload[] = [];
  private tableElements: WorkloadTable[] = [];
  newWorkloadDates: { startDate: string; endDate: string } = { startDate: moment().format('DD/MM/YYYY'), endDate: '' };
  newWorkload: Partial<Workload> = { go: true };
  totalWorkloads = 0;
  workloadHeaderKeys: string[] = ['siglum', 'description', 'own', 'site', 'costCenter', 'direct', 'timeline', 'khrs', 'go', 'expand'];
  ppsidExpandedKeys: string[] = ['ppsidName', 'businessLine', 'programLine', 'productionCenter', 'businessActivity', 'backlogOrderIntake', 'muCode', 'muText'];
  ppsidLabels: string[] = ['PPSID Name', 'Business Line', 'Program Line', 'Production Center', 'Business Activity', 'Backlog / Order Intake', 'MU', 'MU Text'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = computed(() => {
    this.workloads = this.worksyncService.workloads();
    this.totalWorkloads = this.worksyncService.totalWorkloads();
    this.allCostCenter = this.costCenterService.allCostCenters();
    if (this.workloads?.length > 0) {
      const dataSource = this.formatTableData(this.workloads);
      this.tableElements = dataSource.data;
      return dataSource;
    }
    return;
  });

  constructor() {
    this.costCenterService.getAllCostCenters();
    effect(() => {
      this.worksyncService.getPpsids();
      this.paginator.pageIndex = 0;
      this.updateTable();
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.updateTable();
    });
  }

  async dateEvent(type: 'startDate' | 'endDate', event: MatDatepickerInputEvent<Date>, id: number) {
    if (event.value) {
      if (!id) {
        this.newWorkloadDates[type] = moment(event.value).format('DD/MM/YYYY');
        await this.addWorkload({
          [type]: event.value.toISOString(),
        });
      } else {
        const elIndex = this.workloads.findIndex((el) => el.id === id);
        if (type === 'startDate') {
          this.workloads[elIndex].startDate = event.value.toISOString();
        }
        if (type === 'endDate') {
          const partialDateRange = {
            startDate: this.workloads[elIndex].startDate,
            endDate: event.value.toISOString(),
          };
          await this.worksyncService.editWorkload(id, partialDateRange as Partial<Workload>);
          await this.updateTable();
        }
      }
    }
  }

  private getSortParams() {
    let sortActive = this.sort.active;
    let sortDirection = this.sort.direction;
    if (this.sort.direction === '') {
      sortActive = 'id';
      sortDirection = 'desc';
    }
    return [`sort=${sortActive},${sortDirection}`, `page=${this.paginator.pageIndex}`, `size=${this.paginator.pageSize}`];
  }

  async updateTable(filterParams: string[] = []) {
    const sortParams = this.getSortParams();
    await this.worksyncService.getWorkloads([...sortParams, ...filterParams]).catch((err) => console.error(err));
  }

  async addPpsid(value: Partial<Ppsid>, id: number) {
    const ppsid = await this.worksyncService.getPpsid(value.ppsid!);
    if (ppsid) {
      const partialWorkload = {
        ppsid: {
          id: ppsid.id,
        },
      };
      await this.worksyncService.editWorkload(id, partialWorkload as Partial<Workload>);
      await this.updateTable();
    }
  }

  async addEmptyWorkload() {
    await this.updateTable();
    this.worksyncService.addEmptyWorkload();
  }

  async addWorkload(workload?: Partial<Workload>) {
    if (workload) {
      Object.assign(this.newWorkload, workload);
    }
    if (
      this.newWorkload.siglum &&
      this.newWorkload.description &&
      this.newWorkload.own &&
      this.newWorkload.costCenter &&
      this.newWorkload.direct &&
      this.newWorkloadDates.endDate &&
      this.newWorkload.khrs
    ) {
      await this.worksyncService.addWorkload(this.newWorkload);
      await this.updateTable();
      this.newWorkload = { go: true };
      this.newWorkloadDates = { startDate: moment().format('DD/MM/YYYY'), endDate: '' };
    }
  }

  async editElement(value: Partial<Workload | Ppsid | WorkloadTable | CustomSelect>, id: number, objName: string) {
    switch (objName) {
      case 'workload':
        if (id) {
          await this.worksyncService.editWorkload(id, value as Workload);
        } else {
          await this.addWorkload(value as Partial<Workload>);
        }
        break;
      case 'ppsid':
        await this.worksyncService.editPpsid(id, value as Ppsid);
        break;
      case 'siglum': {
        const tableElement = value as WorkloadTable;
        const siglumId = this.filtersService.getSiglumId(tableElement.siglum);
        const partialSiglum = {
          siglum: {
            id: siglumId,
          },
        };
        if (id) {
          await this.worksyncService.editWorkload(id, partialSiglum as Partial<Workload>);
        } else {
          await this.addWorkload(partialSiglum as Partial<Workload>);
        }
        break;
      }
      case 'costCenter':
      case 'location': {
        const selectObject = value as CustomSelect;
        const partialCostCenter = {
          costCenter: {
            id: selectObject.id,
          },
        };
        if (id) {
          await this.worksyncService.editWorkload(id, partialCostCenter as Partial<Workload>);
          await this.updateTable();
        } else {
          await this.addWorkload(partialCostCenter as Partial<Workload>);
        }
        break;
      }
    }
  }

  async toggleGo(workloadId: number, event: MatSlideToggleChange) {
    const partialWorkload = {
      go: event.checked,
    };
    await this.worksyncService.editWorkload(workloadId, partialWorkload as Partial<Workload>);
    this.updateTable();
  }

  private formatTableData(workloads: Workload[]): MatTableDataSource<WorkloadTable> {
    const tableData: WorkloadTable[] = workloads.map((workload: Workload, index: number): WorkloadTable => {
      return {
        id: workload.id,
        costCenterId: workload.costCenter?.id,
        siglum: workload.siglum?.siglumHR,
        description: workload.description,
        own: workload.own,
        site: workload.costCenter?.location?.site, //location.site
        costCenter: workload.costCenter?.costCenterCode ?? '', //costCenter.costCenterCode
        direct: workload.direct,
        timeline: `${moment(workload.startDate).format('DD/MM/YYYY')}\n${moment(workload.endDate).format('DD/MM/YYYY')}`,
        khrs: workload.khrs,
        go: workload.go,
        ppsid_id: workload.ppsid?.id, //ppsid table
        ppsid: workload.ppsid?.ppsid,
        ppsidName: workload.ppsid?.ppsidName ?? '',
        businessLine: workload.ppsid?.businessLine ?? '',
        programLine: workload.ppsid?.programLine ?? '',
        productionCenter: workload.ppsid?.productionCenter ?? '',
        businessActivity: workload.ppsid?.businessActivity ?? '',
        backlogOrderIntake: workload.ppsid?.backlogOrderIntake ?? '',
        muCode: workload.ppsid?.muCode ?? '',
        muText: workload.ppsid?.muText ?? '', //ppsid table end
        scenario: workload.scenario, //workload.scenario
        collar: workload.collar, //workload.collar
        efficiency: workload.costCenter?.efficiency, //costCenter.efficiency
        rateOwn: workload.costCenter?.rateOwn, //costCenter.rateOwn
        fte: workload.fte, //workload.fte FTEs = Hrs / ( Efficiency x (duración de la actividad/ 12))
        keur: workload.keur, //workload.keur
        eac: workload.eac, //workload.eac
        expanded: this.tableElements[index] ? this.tableElements[index].expanded : false,
      };
    });
    return new MatTableDataSource<WorkloadTable>(tableData);
  }
}
