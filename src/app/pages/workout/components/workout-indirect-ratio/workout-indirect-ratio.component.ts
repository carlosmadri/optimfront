import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { EmployeeService } from '@app/services/employee/employee.service';
import { FiltersService } from '@app/services/filters/filters.service';
import { DonutChartComponent } from '@app/shared/graphs/donut-chart/donut-chart.component';
import * as numberUtils from '@src/utils/number-utils';

@Component({
  selector: 'optim-workout-indirect-ratio',
  standalone: true,
  imports: [DonutChartComponent],
  templateUrl: './workout-indirect-ratio.component.html',
  styleUrl: './workout-indirect-ratio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutIndirectRatioComponent {
  private employeeService: EmployeeService = inject(EmployeeService);
  private filtersService: FiltersService = inject(FiltersService);

  directRatio = this.employeeService.directRatio;
  protected readonly directColor = '#00AEC7';
  protected readonly indirectColor = '#FF6B6B';

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.employeeService.getDirectRatio(params);
  }

  directData = computed(() => {
    const directRatio = this.directRatio();
    return directRatio?.direct ? numberUtils.roundToDecimalPlaces(directRatio.direct, 1) : 0;
  });

  indirectData = computed(() => {
    const indirectRatio = this.directRatio();
    return indirectRatio?.indirect ? numberUtils.roundToDecimalPlaces(indirectRatio.indirect, 1) : 0;
  });

  total = computed(() => {
    const directRatioData = this.directRatio()!;
    const totalValue = directRatioData?.indirect / (directRatioData?.direct + directRatioData?.indirect);
    const totalValuePercent = totalValue * 100;

    return isNaN(totalValuePercent) ? 0 : numberUtils.roundToDecimalPlaces(totalValuePercent, 1);

    // if (directRatioData) {

    //     const totalValue = directRatioData.direct / (directRatioData.indirect + directRatioData.direct);
    //     const totalValuePercent = totalValue * 100;
    //     return isNaN(totalValuePercent) ? 0 : numberUtils.roundToDecimalPlaces(totalValuePercent, 1);
    //   } else {
    //   }
    // } else {
    //   return 0;
    // }
  });
}
