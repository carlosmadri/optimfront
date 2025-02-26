import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MapGraphComponent } from '@app/shared/graphs/map-graph/map-graph.component';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { LocationService } from '@src/app/services/location/location.service';

@Component({
  selector: 'optim-workout-fte-location',
  standalone: true,
  imports: [MapGraphComponent],
  templateUrl: './workout-fte-location.component.html',
  styleUrl: './workout-fte-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutFteLocationComponent {
  private locationService: LocationService = inject(LocationService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly fteLocations = this.locationService.fteLocations;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.locationService.getFTEsLocations(params);
  }
}
