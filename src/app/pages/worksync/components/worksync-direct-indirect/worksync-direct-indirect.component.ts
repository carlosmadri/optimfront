import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { DonutChartComponent } from '@src/app/shared/graphs/donut-chart/donut-chart.component';
import * as numberUtils from '@src/utils/number-utils';

@Component({
  selector: 'optim-worksync-direct-indirect',
  standalone: true,
  imports: [DonutChartComponent],
  templateUrl: './worksync-direct-indirect.component.html',
  styleUrl: './worksync-direct-indirect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorksyncDirectIndirectComponent {
  private worksyncService: WorksyncService = inject(WorksyncService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly directRatio = this.worksyncService.directRatio;
  protected readonly directColor = '#00AEC7';
  protected readonly indirectColor = '#FF6B6B';

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getDirectRatio(params);
  }

  directData = computed(() => {
    const directRatio = this.directRatio();
    return directRatio?.direct ? numberUtils.roundToDecimalPlaces(directRatio.direct, 1) : 0;
  });

  indirectData = computed(() => {
    const directRatio = this.directRatio();
    return directRatio?.indirect ? numberUtils.roundToDecimalPlaces(directRatio.indirect, 1) : 0;
  });

  total = computed(() => {
    const directRatio = this.directRatio();
    if (directRatio) {
      const totalValue = directRatio.direct / (directRatio.indirect + directRatio.direct);
      const totalValuePercent = totalValue * 100;
      return isNaN(totalValuePercent) ? 0 : numberUtils.roundToDecimalPlaces(totalValuePercent, 1);
    } else {
      return 0;
    }
  });
}
