import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FiltersService } from '@app/services/filters/filters.service';
import { TeamOutlookService } from '@app/services/team-outlook/team-outlook.service';

@Component({
  selector: 'optim-workout-team-outlook',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './workout-team-outlook.component.html',
  styleUrl: './workout-team-outlook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutTeamOutlookComponent {
  private teamOutlookService: TeamOutlookService = inject(TeamOutlookService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly teamOutlookData = this.teamOutlookService.teamOutlook;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.teamOutlookService.getTeamOutlook(params);
    });
  }
}
