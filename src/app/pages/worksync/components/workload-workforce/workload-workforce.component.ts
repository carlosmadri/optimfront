import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { WorkloadWorkforceAdapter } from '@src/app/shared/adapters/workload-workforce/workload-workforce.adapter';
import { BarChartComponent } from '@src/app/shared/graphs/bar-chart/bar-chart.component';

@Component({
  selector: 'optim-workload-workforce',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './workload-workforce.component.html',
  styleUrl: './workload-workforce.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadWorkforceComponent implements OnInit, AfterViewInit, OnDestroy {
  private filtersService: FiltersService = inject(FiltersService);
  private worksyncService: WorksyncService = inject(WorksyncService);
  private readonly chartSelectorService = inject(ChartSelectorService);
  private readonly workloadWorkforceAdapter = inject(WorkloadWorkforceAdapter);

  protected readonly workloadWorkforceData = this.worksyncService.workloadWorkforce;
  protected readonly selectedChecks = this.chartSelectorService.selectedChecks;

  @ViewChild('chart') chart?: ElementRef;
  chartElementHeight = signal(0);

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(): void {
    const containerHeight = this.chart?.nativeElement?.offsetHeight || 0;
    this.chartElementHeight.set(containerHeight);
  }

  ngAfterViewInit() {
    this.onResize();
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getWorkLoadWorkforce(params);
  }

  lineChartFiltered = computed(() => {
    const workloadWorkforceData = this.workloadWorkforceData();
    if (workloadWorkforceData) {
      const checkedLines = this.selectedChecks();
      const result = this.workloadWorkforceAdapter.filterWorkloadWorkforceLines(workloadWorkforceData, checkedLines);
      return result;
    }
    return null;
  });
}
