import { Component, input } from '@angular/core';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';

@Component({
  selector: 'optim-line-chart',
  template: ``,
  standalone: true,
})
export class MockLineChartComponent {
  lineChartData = input<LineChartData | null>(null);
}
