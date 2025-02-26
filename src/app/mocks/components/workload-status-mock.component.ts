import { Component, input } from '@angular/core';

@Component({
  selector: 'optim-workload-status',
  template: ``,
  standalone: true,
})
export class MockWorkloadStatusComponent {
  requestStatus = input<boolean>(false);
}
