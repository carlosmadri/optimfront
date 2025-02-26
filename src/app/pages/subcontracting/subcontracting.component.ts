import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'optim-subcontracting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './subcontracting.component.html',
  styleUrl: './subcontracting.component.scss',
})
export class SubcontractingComponent {}
