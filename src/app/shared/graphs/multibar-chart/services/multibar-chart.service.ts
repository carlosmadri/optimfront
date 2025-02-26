import { Injectable } from '@angular/core';
import { WorkloadEvolutionBarData } from '@src/app/shared/models/worksync.model';
import * as d3 from 'd3';
import { Selection } from 'd3-selection';

const DEFAULT_MARGIN_LEFT = 10;
const MAIN_COLOR = '#1f2a3f';

@Injectable()
export class MultibarChartService {
  private svg: Selection<SVGGElement, unknown, null, undefined> | undefined;
  private margin = { top: 45, right: 0, bottom: 40, left: DEFAULT_MARGIN_LEFT };
  private width!: number;
  private height!: number;
  private x!: d3.ScaleBand<string>;
  private y!: d3.ScaleLinear<number, number>;
  private color!: (exercise: string) => string;
  private pattern!: d3.ScaleOrdinal<string, string>;
  private opacity!: d3.ScaleOrdinal<string, string>;
  private tooltip!: Selection<HTMLDivElement, unknown, null, undefined>;
  private maxValue = 0;
  private colorMap = new Map<string, string>();

  hasChart(): boolean {
    return !!this.svg;
  }

  createChart(element: HTMLElement, data: WorkloadEvolutionBarData[]): void {
    this.maxValue = d3.max(data, (d) => Math.max(d.total)) || 0;
    this.fitMarginLeftForBigNumbers(this.maxValue);

    this.createSvg(element);
    this.createScales(data);
    this.createTooltip(element);
    this.drawBars(data);
    this.drawAxes();
    this.createLegend();
  }

  updateChart(data: WorkloadEvolutionBarData[]): void {
    this.createScales(data);
    this.drawBars(data);
    this.drawAxes();
    this.createLegend();
  }

  resizeChart(element: HTMLElement, data: WorkloadEvolutionBarData[]): void {
    this.createSvg(element);
    this.createScales(data);
    this.drawBars(data);
    this.drawAxes();
    this.createLegend();
  }

  destroyChart(): void {
    if (this.svg) {
      const svgElement = this.svg.node()?.parentElement;
      if (svgElement && svgElement.parentNode) {
        svgElement.parentNode.removeChild(svgElement);
      }
      this.svg = undefined;
    }
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }

  setColorMap(colorMap: Map<string, string>) {
    this.colorMap = colorMap;
  }

  private createSvg(element: HTMLElement): void {
    d3.select(element).selectAll('*').remove();

    const containerWidth = element.clientWidth || 300;
    const containerHeight = element.clientHeight || 200;
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private createScales(data: WorkloadEvolutionBarData[]): void {
    this.x = d3
      .scaleBand()
      .domain(data.map((d) => d.exercise))
      .range([0, this.width])
      .padding(0.1);

    const maxValue = d3.max(data, (d) => d.total) || 0;
    this.y = d3.scaleLinear().domain([0, maxValue]).range([this.height, 0]);

    // Create a color scale for the main column colors
    this.color = (exercise: string) => this.colorMap.get(exercise) || '#000000';

    // Create a pattern scale for the segments
    this.pattern = d3
      .scaleOrdinal<string>()
      .domain(['ownDirect', 'ownIndirect', 'subDirect', 'subIndirect'])
      .range(['url(#transparentPattern)', 'url(#diagonalHatch)', 'url(#transparentPattern)', 'url(#dotPattern)']);

    // Create a opacity scale for the segments
    this.opacity = d3.scaleOrdinal<string>().domain(['ownDirect', 'ownIndirect', 'subDirect', 'subIndirect']).range(['1', '0.7', '0.2', '0.7']);
  }

  private drawBars(data: WorkloadEvolutionBarData[]): void {
    if (!this.svg) return;

    const keys = ['ownDirect', 'ownIndirect', 'subDirect', 'subIndirect'];
    const stack = d3.stack<WorkloadEvolutionBarData>().keys(keys);
    const stackedData = stack(data);

    // Create patterns
    const defs = this.svg.append('defs');

    // Add this new pattern
    defs
      .append('pattern')
      .attr('id', 'transparentPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 1)
      .attr('height', 1)
      .append('rect')
      .attr('width', 1)
      .attr('height', 1)
      .attr('fill', 'transparent');

    defs
      .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', MAIN_COLOR)
      .attr('stroke-width', 1);

    defs
      .append('pattern')
      .attr('id', 'dotPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('circle')
      .attr('cx', 2)
      .attr('cy', 2)
      .attr('r', 1)
      .attr('fill', MAIN_COLOR);

    this.svg.selectAll('.bar-group').remove();

    const barGroups = this.svg
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${this.x(d.exercise)},0)`);

    const bars = barGroups
      .selectAll('g')
      .data((d) => stackedData.map((layer) => ({ key: layer.key, value: layer.find((item) => item.data === d)!, data: d })))
      .enter()
      .append('g');

    // Add colored rectangles
    bars
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => this.y(d.value[1]))
      .attr('height', (d) => this.y(d.value[0]) - this.y(d.value[1]))
      .attr('width', this.x.bandwidth())
      .attr('fill', (d) => this.color(d.data.exercise))
      .attr('opacity', (d) => +this.opacity(d.key));

    // Add patterned rectangles on top
    bars
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => this.y(d.value[1]))
      .attr('height', (d) => this.y(d.value[0]) - this.y(d.value[1]))
      .attr('width', this.x.bandwidth())
      .attr('fill', (d) => this.pattern(d.key))
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => this.showTooltip(event, d))
      .on('mouseout', () => this.hideTooltip());

    // Add text labels inside the bars
    bars
      .append('text')
      .attr('x', this.x.bandwidth() / 2)
      .attr('y', (d) => (this.y(d.value[0]) + this.y(d.value[1])) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '0.8em')
      .text((d) => {
        const value = d.value[1] - d.value[0];
        const height = this.y(d.value[0]) - this.y(d.value[1]);
        return height > 15 ? Math.round(value) : '';
      });

    // Add exercise labels and totals at the top of the graph
    barGroups
      .append('text')
      .attr('class', 'exercise-label')
      .attr('x', this.x.bandwidth() / 2)
      .attr('y', -this.margin.top + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ccc')
      .attr('font-size', '0.8em')
      .text((d) => d.exercise);

    barGroups
      .append('text')
      .attr('class', 'total-label')
      .attr('x', this.x.bandwidth() / 2)
      .attr('y', -this.margin.top + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '1.2em')
      .text((d) => d.total);
  }
  private drawAxes(): void {
    if (!this.svg) return;

    this.svg.selectAll('.axis').remove();

    // Calculate nice round numbers for the ticks
    const yMax = Math.ceil(this.maxValue);
    const tickStep = this.calculateTickStep(yMax);
    const tickValues = d3.range(0, yMax, tickStep);

    // Ensure the last tick doesn't exceed yMax
    while (tickValues[tickValues.length - 1] > yMax) {
      tickValues.pop();
    }

    // Draw the Y axis with labels
    this.svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(this.y).tickValues(tickValues).tickFormat(d3.format('.0f')))
      .attr('font-size', '0.6em');

    // Draw the X axis line without labels
    this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3
          .axisBottom(this.x)
          .tickSize(0)
          .tickFormat(() => ''),
      );
  }

  private createLegend(): void {
    if (!this.svg) return;

    const legendData = [
      { key: 'ownDirect', label: 'Own Direct', pattern: 'none', opacity: +this.opacity('ownDirect') },
      { key: 'ownIndirect', label: 'Own Indirect', pattern: 'url(#diagonalHatch)', opacity: +this.opacity('ownIndirect') },
      { key: 'subDirect', label: 'Sub Direct', pattern: 'none', opacity: +this.opacity('subDirect') },
      { key: 'subIndirect', label: 'Sub Indirect', pattern: 'url(#dotPattern)', opacity: +this.opacity('subIndirect') },
    ];

    this.svg.selectAll('.legend').remove();

    const legendGroup = this.svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${this.height + 20})`);

    const legendItems = legendGroup
      .selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * 120}, 0)`);

    // Add white background rectangle
    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', 'white')
      .attr('opacity', (d) => d.opacity);

    // Add pattern or color rectangle on top
    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => (d.pattern === 'none' ? 'white' : d.pattern))
      .attr('opacity', (d) => (d.pattern === 'none' ? d.opacity : 1));

    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text((d) => d.label)
      .style('font-size', '0.7em')
      .attr('fill', 'white');
  }

  private createTooltip(element: HTMLElement): void {
    this.tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'workload-tooltip-title')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#d5d5d5')
      .style('border', '2px solid white')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('pointer-events', 'none')
      .style('font-size', '1.0em')
      .style('color', '#3d4a62')
      .style('transition', 'opacity 0.1s ease-in-out')
      .style('white-space', 'nowrap')
      .style('z-index', '1000');
  }

  private showTooltip(event: MouseEvent, d: { key: string; value: d3.SeriesPoint<WorkloadEvolutionBarData>; data: WorkloadEvolutionBarData }): void {
    const formatKey = (key: string) => {
      const parts = key.split(/(?=[A-Z])/);
      return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    };

    const formatValue = (value: number) => d3.format(',')(value);

    const excludeTootltipKeys = new Set(['exercise', 'total', 'barType', 'id']);
    const tooltipContent = `
      ${Object.entries(d.data)
        .reverse()
        .filter(([key]) => !excludeTootltipKeys.has(key))
        .map(([key, value]) => {
          const formattedKey = formatKey(key);
          const formattedValue = formatValue(value as number);
          if (key === d.key) {
            return `<p class="selected-value"><span>${formattedKey}:</span> <span>${formattedValue} khours</span></p>`;
          }
          return `<p><span>${formattedKey}:</span> <span>${formattedValue} khours</span></p>`;
        })
        .join('')}
    `;

    const svgNode = this.svg!.node() as SVGGElement;
    const svgRect = svgNode.getBoundingClientRect();

    const xPosition = svgRect.left + this.x(d.data.exercise)! + this.x.bandwidth() + 17;
    const yPosition = svgRect.top + this.y(d.value[1]) + (this.y(d.value[0]) - this.y(d.value[1])) / 2 + 15;

    this.tooltip.html(tooltipContent).style('left', `${xPosition}px`).style('top', `${yPosition}px`).style('transform', 'translateY(-50%)'); // Center the tooltip vertically

    // Use a transition for showing the tooltip
    this.tooltip.transition().duration(100).style('opacity', 1);
  }

  private hideTooltip(): void {
    this.tooltip.transition().duration(100).style('opacity', 0);
  }

  private fitMarginLeftForBigNumbers(value: number): void {
    const digits = Math.ceil(value).toString().length;
    this.margin.left = DEFAULT_MARGIN_LEFT + digits * 6;
  }

  private calculateTickStep(max: number): number {
    const targetTickCount = 6;
    let step = Math.pow(10, Math.floor(Math.log10(max)));

    while (max / step < targetTickCount) {
      step /= 2;
    }

    while (max / step > targetTickCount) {
      step *= 2;
    }

    return step;
  }
}
