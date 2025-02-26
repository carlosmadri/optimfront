import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FiltersService } from '@app/services/filters/filters.service';
import { LeversService } from '@app/services/levers/levers.service';
import { DivergingBarComponent } from '@app/shared/graphs/diverging-bar/diverging-bar.component';

@Component({
  selector: 'optim-workout-levers-eoy',
  standalone: true,
  imports: [MatButtonModule, DivergingBarComponent],
  templateUrl: './workout-levers-eoy.component.html',
  styleUrl: './workout-levers-eoy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutLeversEoyComponent {
  private leversService: LeversService = inject(LeversService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly totalByEoY = this.leversService.totalByEoY;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.leversService.getTotalByEoY(params);
    });
  }

  sortedTotalByEoY = computed(() => {
    return this.totalByEoY().sort((a, b) => a.leverType.localeCompare(b.leverType));
  });
}
