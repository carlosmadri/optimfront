import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapGraphService } from './services/map-graph.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MapData } from '../../models/graphs/map-charts.model';

@Component({
  selector: 'optim-map-graph',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './map-graph.component.html',
  styleUrl: './map-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MapGraphService],
})
export class MapGraphComponent implements OnInit, OnDestroy {
  mapService: MapGraphService = inject(MapGraphService);

  @ViewChild('mapContainer', { static: true }) private mapContainer!: ElementRef;

  fteLocations = input<MapData[]>([]);

  constructor() {
    effect(() => {
      this.redrawMap();
    });
  }

  ngOnInit() {
    this.initializeMap();
    window.addEventListener('resize', this.redrawMap.bind(this));
  }

  async initializeMap() {
    const element = this.mapContainer.nativeElement;
    const width = element.clientWidth;
    const height = element.clientHeight;
    this.mapService.initializeMap(element, width, height);
    await this.mapService.loadWorldMap();
    this.mapService.drawMap(this.fteLocations());
  }

  resetZoom() {
    this.mapService.resetZoom();
  }

  private redrawMap() {
    const element = this.mapContainer.nativeElement;
    const width = element.clientWidth;
    const height = element.clientHeight;
    this.mapService.redrawMap(this.mapContainer.nativeElement, width, height, this.fteLocations());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.redrawMap);
  }
}
