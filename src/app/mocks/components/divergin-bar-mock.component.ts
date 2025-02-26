import { Component, input } from '@angular/core';
import { LeversTotal } from '@src/app/shared/models/levers-total.model';

@Component({
  selector: 'optim-diverging-bar',
  template: ``,
  standalone: true,
})
export class MockDivergingBarComponent {
  chartData = input<LeversTotal[]>([]);
}
