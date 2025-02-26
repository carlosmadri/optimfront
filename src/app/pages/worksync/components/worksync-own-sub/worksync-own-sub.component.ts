import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FiltersService } from '@app/services/filters/filters.service';
import { DonutChartComponent } from '@app/shared/graphs/donut-chart/donut-chart.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import * as numberUtils from '@src/utils/number-utils';

@Component({
  selector: 'optim-worksync-own-sub',
  standalone: true,
  imports: [DonutChartComponent],
  templateUrl: './worksync-own-sub.component.html',
  styleUrl: './worksync-own-sub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorksyncOwnSubComponent {
  private worksyncService: WorksyncService = inject(WorksyncService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly ownSub = this.worksyncService.ownSub;
  protected readonly ownColor = '#00AEC7';
  protected readonly subColor = '#FF6B6B';

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getOwnSubRatio(params);
  }

  ownData = computed(() => {
    const ownSub = this.ownSub();
    return ownSub?.own ? numberUtils.roundToDecimalPlaces(ownSub.own, 1) : 0;
  });

  subData = computed(() => {
    const ownSub = this.ownSub();
    return ownSub?.sub ? numberUtils.roundToDecimalPlaces(ownSub.sub, 1) : 0;
  });

  total = computed(() => {
    const ownSub = this.ownSub();
    if (ownSub) {
      const totalValue = ownSub.own / (ownSub.sub + ownSub.own);
      const totalValuePercent = totalValue * 100;
      return isNaN(totalValuePercent) ? 0 : numberUtils.roundToDecimalPlaces(totalValuePercent, 1);
    } else {
      return 0;
    }
  });
}
