import { Component, input } from '@angular/core';

@Component({
  selector: 'optim-chart-selector',
  template: ``,
  standalone: true,
})
export class MockChartSelectorComponent {
  selectorType = input<'monthly' | 'worksync' | undefined>();
}
