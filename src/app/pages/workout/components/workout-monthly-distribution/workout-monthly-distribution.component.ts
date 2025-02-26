import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal } from '@angular/core';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { MonthlyDistributionAdapter } from '@src/app/shared/adapters/monthly-distribution/monthly-distribution.adapter';
import { LineChartComponent } from '@src/app/shared/graphs/line-chart/line-chart.component';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';
import { ChartIds } from '@src/app/shared/models/worksync.model';

@Component({
  selector: 'optim-workout-monthly-distribution',
  standalone: true,
  imports: [LineChartComponent],
  templateUrl: './workout-monthly-distribution.component.html',
  styleUrl: './workout-monthly-distribution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutMonthlyDistributionComponent {
  setChartSelectors = input<boolean>(false);
  private employeeService: EmployeeService = inject(EmployeeService);
  private filtersService: FiltersService = inject(FiltersService);
  private readonly monthlyAdapter: MonthlyDistributionAdapter = inject(MonthlyDistributionAdapter);
  private readonly chartSelectorService = inject(ChartSelectorService);

  protected readonly selectedChecks = this.chartSelectorService.selectedChecks;

  lineChartData: Signal<LineChartData | null> = this.employeeService.monthlyData;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.employeeService.getMonthlyDistribution(params);
    });

    effect(
      () => {
        const monthlyData = this.lineChartData();
        if (this.setChartSelectors()) {
          const allChecksIds: ChartIds[] = monthlyData?.ids ? monthlyData.ids : [];
          this.chartSelectorService.setWorkloadChecks(allChecksIds);
          console.log('allChecksIds', allChecksIds);
        }
      },
      { allowSignalWrites: true },
    );
  }

  lineChartFiltered = computed(() => {
    const lineChartData = this.lineChartData();
    if (lineChartData === null) {
      return null;
    }

    const checkedLines = this.selectedChecks();

    const result = this.monthlyAdapter.filterMonthlyDistributionLines(lineChartData, checkedLines);
    return result;
  });
}
