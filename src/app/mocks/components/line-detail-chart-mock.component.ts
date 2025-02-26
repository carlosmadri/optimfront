import { Component, input } from '@angular/core';
import { LineDetailChartData } from '@src/app/shared/models/graphs/line-detail-chart.model';

@Component({
  selector: 'optim-line-detail-chart',
  template: ``,
  standalone: true,
})
export class MockLineDetailChartComponent {
  chartData = input<LineDetailChartData | null>(null);
}
