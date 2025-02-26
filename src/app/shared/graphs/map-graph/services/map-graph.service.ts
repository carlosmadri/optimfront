import { Injectable } from '@angular/core';
import { Cluster, MapData, CountryFeature, DataType, Region, WorldAtlas } from '@src/app/shared/models/graphs/map-charts.model';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Injectable()
export class MapGraphService {
  protected svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private projection!: d3.GeoProjection;
  private path!: d3.GeoPath;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>;
  private width!: number;
  private height!: number;
  private zoomLevel = 1;
  private zoomState: 'full' | 'country' | 'region' | 'max' = 'full';
  private countriesToDisplay: CountryFeature[] = [];
  private mapData: MapData[] = [];

  private maxRadiusValue = 0;
  private readonly ZOOM_MAX = 18;
  private readonly ZOOM_REGION = 8;
  private readonly ZOOM_COUNTRY = 4;
  private readonly MIN_RADIUS = 5;
  private readonly MAX_RADIUS = 30;
  private readonly RADIUS_SITE_SCALER = 2;
  private world?: WorldAtlas;

  private readonly CLUSTER_RADIUS = 30;

  initializeMap(element: HTMLElement, width: number, height: number): void {
    this.width = width;
    this.height = height;

    // Remove existing SVG if it exists
    d3.select(element).select('svg').remove();

    this.svg = d3.select(element).append('svg').attr('width', width).attr('height', height);
    this.g = this.svg.append('g');

    this.projection = d3
      .geoMercator()
      .scale(100)
      .translate([width / 2, height / 1.5]);
    this.path = d3.geoPath().projection(this.projection);

    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, this.ZOOM_MAX])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => this.zoomed(event));

    this.svg.call(this.zoom);

    // Remove existing tooltip if it exists
    d3.select('body').select('.map-tooltip').remove();
    this.tooltip = d3.select('body').append('div').attr('class', 'map-tooltip').style('opacity', 0);
  }

  async loadWorldMap(): Promise<void> {
    this.world = await d3.json<WorldAtlas>('countries.json');
  }

  drawMap(mapData: MapData[]): void {
    if (!this.world) {
      return;
    }

    this.maxRadiusValue = Math.max(...mapData.map((item) => item.total));

    // Clear existing elements
    this.g.selectAll('*').remove();

    const countries = topojson.feature(this.world, this.world.objects.countries) as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    this.g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'map-country').attr('d', this.path);

    this.mapData = mapData;

    if (mapData.length) {
      this.countriesToDisplay = (countries.features as CountryFeature[]).filter((d) => mapData.map((country) => country.name === d.properties.name));
      this.drawCountryCircles();
      this.calculateBounds();
    }
  }

  private zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.zoomLevel = event.transform.k;
    this.setZoomState(this.zoomLevel);
    this.g.attr('transform', event.transform.toString());
    if (this.zoomLevel > 4) {
      this.drawRegionCircles();
    } else {
      this.drawCountryCircles();
    }
  }

  private setZoomState(zoomValue: number): void {
    if (zoomValue === this.ZOOM_MAX) this.zoomState = 'max';
    else if (zoomValue >= this.ZOOM_REGION) this.zoomState = 'region';
    else if (zoomValue >= this.ZOOM_COUNTRY) this.zoomState = 'country';
    else this.zoomState = 'full';
  }

  private drawCountryCircles(): void {
    this.clearCirclesAndLabels();
    const clusters = this.clusterPoints(this.countriesToDisplay, 'country');
    this.drawClusters(clusters, 'country');
  }

  private drawRegionCircles(): void {
    this.clearCirclesAndLabels();
    const regions = this.mapData.flatMap((country) => country.regions);
    const clusters = this.clusterPoints(regions, 'region');
    this.drawClusters(clusters, 'region');
  }

  private clusterPoints<T extends CountryFeature | Region>(data: T[], type: 'country' | 'region'): Cluster[] {
    const clusters: Cluster[] = [];

    data.forEach((point) => {
      const [x, y] = this.getCoordinates(point, type);
      let addedToCluster = false;

      for (const cluster of clusters) {
        if (this.distance(cluster, { x, y }) <= this.CLUSTER_RADIUS / this.zoomLevel) {
          cluster.points.push(point);
          cluster.x = cluster.points.reduce((sum, p) => sum + this.getCoordinates(p, type)[0], 0) / cluster.points.length;
          cluster.y = cluster.points.reduce((sum, p) => sum + this.getCoordinates(p, type)[1], 0) / cluster.points.length;
          addedToCluster = true;
          break;
        }
      }

      if (!addedToCluster) {
        clusters.push({ x, y, points: [point] });
      }
    });

    return clusters;
  }

  private distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  private drawClusters(clusters: Cluster[], type: 'country' | 'region'): void {
    clusters.forEach((cluster) => {
      if (cluster.points.length === 1) {
        this.drawSinglePoint(cluster.points[0], type);
      } else {
        this.drawCluster(cluster, type);
      }
    });
  }

  private drawSinglePoint(point: CountryFeature | Region, type: 'country' | 'region'): void {
    const [x, y] = this.getCoordinates(point, type);
    const value = this.getValue(point, type);

    this.g
      .append('circle')
      .attr('class', 'map-site-circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', this.calculateRadius(value, type) / this.zoomLevel)
      .attr('fill', type === 'country' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)')
      .on('click', (event) => this.handleClick(event, point, type))
      .on('mouseover', (event) => this.showTooltip(event, point, type))
      .on('mouseout', () => this.hideTooltip());

    this.g
      .append('text')
      .attr('class', 'map-site-count')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${11 / this.zoomLevel}px`)
      .text(value.toFixed(1));
  }

  private drawCluster(cluster: Cluster, type: 'country' | 'region'): void {
    const totalValue = cluster.points.reduce((sum, point) => sum + this.getValue(point, type), 0);

    this.g
      .append('circle')
      .attr('class', 'map-site-circle')
      .attr('cx', cluster.x)
      .attr('cy', cluster.y)
      .attr('r', this.calculateRadius(totalValue, type) / this.zoomLevel)
      .attr('fill', type === 'country' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)')
      .on('click', (event) => this.handleClusterClick(event, cluster, type))
      .on('mouseover', (event) => this.showClusterTooltip(event, cluster, type))
      .on('mouseout', () => this.hideTooltip());

    this.g
      .append('text')
      .attr('class', 'map-site-count')
      .attr('x', cluster.x)
      .attr('y', cluster.y)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${11 / this.zoomLevel}px`)
      .text(totalValue.toFixed(1));
  }

  private clearCirclesAndLabels(): void {
    this.g.selectAll('.map-site-circle, .map-site-count').remove();
  }

  private handleClusterClick(event: MouseEvent, cluster: Cluster, type: 'country' | 'region'): void {
    event.stopPropagation();
    const scale = type === 'country' ? this.ZOOM_COUNTRY : this.ZOOM_REGION;

    // Calculate the center of the cluster in pixel coordinates
    const [centerX, centerY] = [cluster.x, cluster.y];

    // Calculate the translation needed to center the cluster
    const translate: [number, number] = [this.width / 2 - centerX * scale, this.height / 2 - centerY * scale];

    // Create the new transform
    const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);

    // Apply the transform with a smooth transition
    this.svg.transition().duration(750).call(this.zoom.transform, transform);

    // Update the zoom level and redraw circles
    this.zoomLevel = scale;
    if (type === 'country') {
      this.drawCountryCircles();
    } else {
      this.drawRegionCircles();
    }
  }

  private showClusterTooltip(event: MouseEvent, cluster: Cluster, type: 'country' | 'region'): void {
    const content = cluster.points
      .map((point) => {
        const name = type === 'country' ? (point as CountryFeature).properties.name : (point as Region).name;
        const value = this.getValue(point, type);
        return `${name}: ${value.toFixed(1)}`;
      })
      .join('<br>');

    this.tooltip.transition().duration(200).style('opacity', 0.9);
    this.tooltip
      .html(`${content}`)
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY - 28}px`);
  }

  private getCoordinates<T extends CountryFeature | Region>(d: T, type: 'country' | 'region'): [number, number] {
    const coords = type === 'country' ? this.mapData.find((country) => country.name === (d as CountryFeature).properties.name)?.coords : (d as Region).coords;
    return coords ? this.projection(coords) || [0, 0] : [0, 0];
  }

  private getValue<T extends CountryFeature | Region>(d: T, type: 'country' | 'region'): number {
    return type === 'country' ? this.mapData.find((country) => country.name === (d as CountryFeature).properties.name)?.total || 0 : (d as Region).value;
  }

  private calculateRadius(value: number, type: 'country' | 'region'): number {
    const scaleFactor = type === 'country' ? 1 : this.RADIUS_SITE_SCALER;
    const proportion = value / this.maxRadiusValue;
    const radius = this.MIN_RADIUS + (this.MAX_RADIUS - this.MIN_RADIUS) * proportion;
    const scaledRadius = radius * scaleFactor;

    return Math.max(this.MIN_RADIUS, Math.min(this.MAX_RADIUS, scaledRadius));
  }

  private handleClick(event: MouseEvent, d: DataType, type: 'country' | 'region'): void {
    event.stopPropagation();
    const [x, y] = this.getCoordinates(d, type);
    const scale = type === 'country' ? this.ZOOM_REGION : this.ZOOM_MAX;
    const translate: [number, number] = [this.width / 2 - scale * x, this.height / 2 - scale * y];

    this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

    if (type === 'country') this.drawRegionCircles();
  }

  private showTooltip(event: MouseEvent, d: DataType, type: 'country' | 'region'): void {
    this.tooltip.transition().duration(200).style('opacity', 0.9);
    this.tooltip
      .html(
        `${type === 'region' ? 'Site' : type.charAt(0).toUpperCase() + type.slice(1)}: ${type === 'country' ? (d as CountryFeature).properties.name : (d as Region).name}`,
      )
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY - 28}px`);
  }

  private hideTooltip(): void {
    this.tooltip.transition().duration(500).style('opacity', 0);
  }

  resetZoom(): void {
    if (this.zoomState === 'full') return;

    if (this.zoomState === 'country' || this.zoomState === 'region') {
      this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
      this.drawCountryCircles();
    } else if (this.zoomState === 'max') {
      this.calculateBounds();
    }
  }

  private calculateBounds(): void {
    const circlesCoords = this.mapData
      .flatMap((data) => data.regions)
      .map((region) => this.projection(region.coords))
      .filter((coord): coord is [number, number] => coord !== null);

    const bounds = this.getBounds(circlesCoords);
    const scale = this.calculateScale(bounds);
    const translate: [number, number] = this.calculateTranslate(bounds, scale);

    this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  private getBounds(coords: [number, number][]): [number, number, number, number] {
    return coords.reduce(
      ([minX, minY, maxX, maxY], [x, y]) => [Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)],
      [Infinity, Infinity, -Infinity, -Infinity],
    );
  }

  private calculateScale(bounds: [number, number, number, number], padding = 1.1): number {
    // Increase the bounds by the padding factor
    const dx = (bounds[2] - bounds[0]) * padding;
    const dy = (bounds[3] - bounds[1]) * padding;

    // Calculate the scale
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.width, dy / this.height)));

    return scale;
  }

  private calculateTranslate(bounds: [number, number, number, number], scale: number): [number, number] {
    const x = (bounds[0] + bounds[2]) / 2;
    const y = (bounds[1] + bounds[3]) / 2;
    return [this.width / 2 - scale * x, this.height / 2 - scale * y];
  }

  public redrawMap(element: HTMLElement, width: number, height: number, mapData: MapData[]): void {
    this.width = width;
    this.height = height;

    d3.select(element).select('svg').remove();
    this.initializeMap(element, width, height);
    this.drawMap(mapData);
    if (mapData.length) {
      this.calculateBounds();
    }
  }
}
