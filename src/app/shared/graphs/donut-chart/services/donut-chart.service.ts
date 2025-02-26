import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class DonutChartService {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined = undefined;
  private chart: d3.Selection<SVGGElement, unknown, null, undefined> | undefined = undefined;
  private titleColor = '#ffffff';
  private subtitleColor = '#ffffff';
  private width!: number;
  private height!: number;
  private radius!: number;

  hasChart(): boolean {
    return !!this.svg;
  }

  createChart(element: HTMLElement, titleColor?: string, subtitleColot?: string): void {
    this.width = element.clientWidth || 200; // Fallback width
    this.height = element.clientHeight || 200; // Fallback height

    this.updateRadius();

    d3.select(element).selectAll('*').remove();
    this.svg = d3.select(element).append('svg').attr('width', '100%').attr('height', '100%').attr('viewBox', `0 0 ${this.width} ${this.height}`);
    this.chart = this.svg.append('g').attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    if (titleColor) {
      this.titleColor = titleColor;
    }
    if (subtitleColot) {
      this.subtitleColor = subtitleColot;
    }
  }

  updateChart(data: number[], colors: string[], title?: string, subtitle?: string): void {
    if (!this.chart) {
      console.error('Chart not initialized. Call createChart first.');
      return;
    }

    this.chart.selectAll('*').remove();

    const pie = d3.pie<number>().sort(null);
    const arcGenerator = d3
      .arc<d3.PieArcDatum<number>>()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius);

    // Check if all values are 0
    const allZero = data.every((value) => value === 0);

    if (allZero) {
      // Create a single data point representing the full circle
      const fullCircleData = [1];
      const arcs = this.chart.selectAll<SVGGElement, d3.PieArcDatum<number>>('arc').data(pie(fullCircleData)).enter().append('g').attr('class', 'arc');

      arcs
        .append('path')
        .attr('d', (d) => arcGenerator(d))
        .attr('fill', 'white');
    } else {
      // Draw the regular donut chart with provided colors
      const colorScale = this.getColorScale(data, colors);
      const arcs = this.chart.selectAll<SVGGElement, d3.PieArcDatum<number>>('arc').data(pie(data)).enter().append('g').attr('class', 'arc');

      arcs
        .append('path')
        .attr('d', (d) => arcGenerator(d))
        .attr('fill', (_, i) => colorScale(i));
    }

    if (title) {
      const titleElement = this.chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'title')
        .text(title)
        .attr('font-size', () => Math.min(30, Math.max(12, this.radius / 2)) + 'px')
        .attr('fill', this.titleColor);

      if (!subtitle) {
        titleElement.attr('dy', '0.35em'); // Center the title vertically if no subtitle
      } else {
        titleElement.attr('dy', '-0.2em'); // Position title above subtitle
      }
    }

    if (subtitle) {
      this.chart.append('text').attr('text-anchor', 'middle').attr('dy', '1.2em').attr('class', 'subtitle').text(subtitle).attr('fill', this.subtitleColor);
    }
  }

  private updateRadius(): void {
    this.radius = Math.min(this.width, this.height) / 2;
  }

  private getColorScale(data: number[], colors: string[]): d3.ScaleOrdinal<number, string> | d3.ScaleLinear<string, string> {
    if (colors.length === data.length) {
      return d3.scaleOrdinal<number, string>().range(colors);
    } else if (colors.length === 1) {
      const baseColor = d3.hsl(colors[0]);
      return d3
        .scaleLinear<string>()
        .domain([0, data.length - 1])
        .range([baseColor.brighter(0.5).toString(), baseColor.darker(0.5).toString()])
        .interpolate(d3.interpolateHsl);
    } else {
      return d3.scaleOrdinal<number, string>(d3.schemeCategory10);
    }
  }

  destroyChart(): void {
    if (this.svg) {
      this.svg.remove();
      this.svg = undefined;
      this.chart = undefined;
    }
  }
}
