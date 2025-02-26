import { Component, input } from '@angular/core';
import { WorkloadEvolution } from '@src/app/shared/models/worksync.model';

@Component({
  selector: 'optim-multibar-chart',
  template: ``,
  standalone: true,
})
export class MockMultibarChartComponent {
  chartData = input<WorkloadEvolution[]>([]);
}
