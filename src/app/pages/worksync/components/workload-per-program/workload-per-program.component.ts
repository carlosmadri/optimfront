import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { LineDetailChartComponent } from '@src/app/shared/graphs/line-detail-chart/line-detail-chart.component';
import { LineDetailChartData } from '@src/app/shared/models/graphs/line-detail-chart.model';

@Component({
  selector: 'optim-workload-per-program',
  standalone: true,
  imports: [LineDetailChartComponent, MatButtonModule, MatIconModule],
  templateUrl: './workload-per-program.component.html',
  styleUrl: './workload-per-program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadPerProgramComponent {
  private filtersService: FiltersService = inject(FiltersService);
  private worksyncService: WorksyncService = inject(WorksyncService);

  private _chartData = signal<LineDetailChartData[]>([]);

  chartData = computed(() => this._chartData());

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.worksyncService.getWorkLoadPerProgram(params);
    });
    effect(
      () => {
        const perProgramData = this.worksyncService.perProgram();
        this.loadData(perProgramData);
        this.selectFirstProgram(perProgramData);
      },
      { allowSignalWrites: true },
    );
  }

  async loadData(perProgramData: LineDetailChartData[]) {
    const data = this.processData(perProgramData);
    this._chartData.set(data);
  }

  private processData(data: LineDetailChartData[]): LineDetailChartData[] {
    const filteredData = this.removeProgramsWithNoKhours(data);
    return this.selectFirstProgram(filteredData);
  }

  private removeProgramsWithNoKhours(data: LineDetailChartData[]): LineDetailChartData[] {
    return data.filter((d) => d.khours > 0);
  }

  private selectFirstProgram(data: LineDetailChartData[]): LineDetailChartData[] {
    if (data.length === 0) return data;

    return [{ ...data[0], selected: true }, ...data.slice(1).map((item) => ({ ...item, selected: false }))];
  }

  selectedProgram = computed(() => {
    return this.chartData().find((d) => d.selected);
  });

  hasPrev = computed(() => {
    return !this.chartData()
      ?.slice(0, 1)
      .some((d) => d.selected);
  });

  hasNext = computed(() => {
    return !this.chartData()
      .slice(-1)
      .some((d) => d.selected);
  });

  nextProgram() {
    this._chartData.update((data) => {
      const selectedIdx = data.findIndex((d) => d.selected);
      if (selectedIdx === -1 || selectedIdx === data.length - 1) {
        return data;
      }

      data[selectedIdx].selected = false;
      data[selectedIdx + 1].selected = true;
      return [...data];
    });
  }

  prevProgram() {
    this._chartData.update((data) => {
      const selectedIdx = data.findIndex((d) => d.selected);
      if (selectedIdx === -1 || selectedIdx === 0) {
        return data;
      }

      data[selectedIdx].selected = false;
      data[selectedIdx - 1].selected = true;
      return [...data];
    });
  }
}
