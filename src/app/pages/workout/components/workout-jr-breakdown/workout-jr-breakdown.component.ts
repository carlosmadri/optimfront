import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DonutChartComponent } from '@app/shared/graphs/donut-chart/donut-chart.component';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';

interface dataType {
  type: string;
  count: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'optim-workout-jr-breakdown',
  standalone: true,
  imports: [DonutChartComponent, NgStyle, MatIconModule],
  templateUrl: './workout-jr-breakdown.component.html',
  styleUrl: './workout-jr-breakdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutJrBreakdownComponent {
  private jobRequestService: JobRequestService = inject(JobRequestService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly summaryType = this.jobRequestService.summaryType;

  defaultData: dataType[] = [
    { type: 'Replacement', count: 0, color: '#00AEC7', icon: 'switch_account' },
    { type: 'Creation', count: 0, color: '#FF6B6B', icon: 'person_add_alt_1' },
    { type: 'Temporary Extension', count: 0, color: '#FFD93D', icon: 'more_time' },
    { type: 'Conversion', count: 0, color: '#FF8811', icon: 'published_with_changes' },
  ];

  colors = ['#00AEC7', '#FF6B6B', '#FFD93D', '#FF8811'];

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.jobRequestService.getTypesSummary(params);
  }

  mappedSummaryTypes = computed(() => {
    const summaryType = this.summaryType();
    const mergedArray = this.defaultData.map((defaultItem) => {
      const matchingItem = summaryType.find((jrItem) => jrItem.type === defaultItem.type);
      if (matchingItem) {
        return { ...defaultItem, count: defaultItem.count + matchingItem.count };
      }
      return defaultItem;
    });
    return mergedArray;
  });

  typesValues = computed(() => {
    return this.mappedSummaryTypes().map((item) => item.count);
  });

  totalJRs = computed(() => {
    return this.typesValues()
      .reduce((acc, value) => acc + value, 0)
      .toFixed(1);
  });
}
