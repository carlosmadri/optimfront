import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { WorkloadEvolutionAdapter } from '@src/app/shared/adapters/workload-evolution/workload-evolution.adapter';
import { MultibarChartComponent } from '@src/app/shared/graphs/multibar-chart/multibar-chart.component';
import { ChartIds, WorkloadEvolutionBarData } from '@src/app/shared/models/worksync.model';

enum graphTypes {
  ALL = 'all',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Component({
  selector: 'optim-workload-evolution',
  standalone: true,
  imports: [MultibarChartComponent, FormsModule, MatSelectModule, MatOptionModule],
  templateUrl: './workload-evolution.component.html',
  styleUrl: './workload-evolution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadEvolutionComponent {
  private filtersService: FiltersService = inject(FiltersService);
  private worksyncService: WorksyncService = inject(WorksyncService);
  private readonly chartSelectorService = inject(ChartSelectorService);
  private readonly workloadEvolutionAdapter = inject(WorkloadEvolutionAdapter);

  protected readonly evolutionData = this.worksyncService.evolution;
  protected readonly selectedChecks = this.chartSelectorService.selectedChecks;

  private currentParams: string[] | undefined;

  graphTypes = graphTypes;

  selectedGraphType: graphTypes = graphTypes.ALL;

  constructor() {
    effect(() => {
      this.currentParams = this.filtersService.paramsFilter();
      this.loadData(this.currentParams);
    });
    effect(
      () => {
        const evolutionData = this.evolutionData();
        const allChecksIds: ChartIds[] = evolutionData ? evolutionData.data.map((data) => data.id) : [];
        this.chartSelectorService.setWorkloadChecks(allChecksIds);
      },
      { allowSignalWrites: true },
    );
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getWorkLoadEvolution(params);
  }

  lineChartFiltered = computed<WorkloadEvolutionBarData[]>(() => {
    const evolutionData = this.evolutionData();
    const checkedLines = this.selectedChecks();
    if (evolutionData?.data && evolutionData.data.length > 0 && checkedLines.length > 0) {
      const result = this.workloadEvolutionAdapter.filterWorkloadEvolutionLines(evolutionData?.data, checkedLines);
      return result.reverse();
    }
    return [];
  });

  multipleSiglums = computed<boolean>(() => {
    const evolutionData = this.evolutionData();
    return evolutionData?.multipleSiglums || false;
  });

  onGraphChange() {
    console.log(this.selectedGraphType);
    let params = this.currentParams;
    if (this.selectedGraphType !== graphTypes.ALL) {
      const validationStatusParam = `validationStatus=${this.selectedGraphType}`;
      params = [...(this.currentParams || []), validationStatusParam];
    }
    this.loadData(params);
  }
}
