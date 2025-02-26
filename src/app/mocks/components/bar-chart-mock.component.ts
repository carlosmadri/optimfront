import { Component, input } from '@angular/core';
import { WorkloadWorkforce } from '@src/app/shared/models/worksync.model';

@Component({
  selector: 'optim-bar-chart',
  template: ``,
  standalone: true,
})
export class MockBarChartComponent {
  chartData = input<WorkloadWorkforce>();
}
