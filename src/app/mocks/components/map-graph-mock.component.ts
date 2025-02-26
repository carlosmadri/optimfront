import { Component, input } from '@angular/core';
import { MapData } from '@src/app/shared/models/graphs/map-charts.model';

@Component({
  selector: 'optim-map-graph',
  template: ``,
  standalone: true,
})
export class MockMapGraphComponent {
  fteLocations = input<MapData[]>([]);
}
