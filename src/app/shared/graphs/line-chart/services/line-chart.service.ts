import { Injectable, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { getOverallMinMax } from '@src/utils/number-utils';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';

const DEFAULT_MARGIN_LEFT = 30;
@Injectable()
export class LineChartService {
  private svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private margin = { top: 10, right: 25, bottom: 45, left: DEFAULT_MARGIN_LEFT };
  private width = 0;
  private height = 0;
  private x!: d3.ScalePoint<string>;
  private y!: d3.ScaleLinear<number, number>;
  private line!: d3.Line<[string, number]>;
  private minMax!: { min: number; max: number };
  private colors!: string[];

  createChart(element: ElementRef, data: LineChartData): void {
    // Destroy existing SVG if it exists
    d3.select(element.nativeElement).select('svg').remove();

    this.colors = data.colors;

    const allValues = data.specificPoint ? [...data.values, [data.specificPoint]] : data.values;

    this.minMax = getOverallMinMax(allValues);

    this.fitMarginLeftForBigNumbers(this.minMax.max);

    // Create new SVG
    const svgElement = d3.select(element.nativeElement).append('svg').attr('width', '100%').attr('height', '100%');

    this.svg = svgElement.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.updateChart(element, data, this.colors);
  }

  updateChart(element: ElementRef, data: LineChartData, colors: string[]): void {
    this.colors = colors;
    const boundingRect = element.nativeElement.getBoundingClientRect();

    this.width = boundingRect.width - this.margin.left - this.margin.right;
    this.height = boundingRect.height - this.margin.top - this.margin.bottom;

    // Clear existing chart
    this.svg.selectAll('*').remove();

    // X scale
    this.x = d3.scalePoint().domain(data.month).range([0, this.width]);

    // X axis
    this.svg.append('g').attr('transform', `translate(0,${this.height})`).call(d3.axisBottom(this.x)).attr('font-size', '0.6em');

    // Y scale
    const yDomain = [Math.floor(this.minMax.min), Math.ceil(this.minMax.max)];
    this.y = d3.scaleLinear().range([this.height, 0]).domain(yDomain);

    // Y axis
    const tickCount = this.getAppropriateTickCount(yDomain[0], yDomain[1]);
    this.svg
      .append('g')
      .attr('transform', `translate(0,0)`)
      .call(d3.axisLeft(this.y).ticks(tickCount).tickFormat(d3.format('.1f')))
      .attr('font-size', '0.6em');
    // // Y
    // this.svg.append('g').attr('transform', `translate(0,0)`).call(d3.axisLeft(this.y)).attr('font-size', '0.6em');

    // Line function
    this.line = d3
      .line<[string, number]>()
      .x((d) => this.x(d[0])!)
      .y((d) => this.y(d[1]));

    // Draw lines and average lines
    data.values.forEach((values, index) => {
      this.drawLine(data.month, values, this.colors[index]);
      if (data.showAvg[index]) {
        this.drawAverageLine(values, this.colors[index]);
      }
    });

    // Draw specific point if provided
    if (data.specificPoint && data.specificPointColor) {
      this.drawSpecificPoint(data.specificPoint, data.specificPointColor);
    }

    // Add legend
    if (data.labels) {
      this.addLegend(data.labels, data.showAvg, data.specificPointLabel, data.specificPointColor);
    }

    // Update SVG size and position
    this.svg.attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawSpecificPoint(point: number, color: string): void {
    const lastMonth = this.x.domain()[this.x.domain().length - 1];
    this.svg.append('circle').attr('cx', this.x(lastMonth)!).attr('cy', this.y(point)).attr('r', 5).attr('fill', color);
  }

  private drawLine(months: string[], values: number[], color: string): void {
    const lineData = months.map((month, i) => [month, values[i]] as [string, number]);
    this.svg.append('path').datum(lineData).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2).attr('d', this.line);
  }

  private drawAverageLine(values: number[], color: string): void {
    const average = d3.mean(values);
    if (average !== undefined) {
      this.svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', this.width)
        .attr('y1', this.y(average))
        .attr('y2', this.y(average))
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    }
  }

  private addLegend(labels: string[], showAvg: boolean[], specificLabel?: string, specificPointColor?: string): void {
    const legendData = labels.flatMap((label, index) => [
      { label, color: this.colors[index], dashed: false },
      ...(showAvg[index] ? [{ label: `Avg - ${label}`, color: this.colors[index], dashed: true }] : []),
    ]);

    // Add specific point to legend if provided
    if (specificLabel && specificPointColor) {
      legendData.push({ label: `${specificLabel}`, color: specificPointColor, dashed: false });
    }

    const legendGroup = this.svg.append('g').attr('transform', `translate(0,${this.height + 20})`);

    const legendItems = legendGroup.selectAll('g').data(legendData).enter().append('g');

    let xOffset = this.width;

    legendItems.each((d, i, nodes) => {
      const legendItem = d3.select(nodes[i]);

      if (d.label === `${specificLabel}`) {
        // Draw a circle for the specific point
        legendItem
          .append('circle')
          .attr('cx', xOffset - 7.5)
          .attr('cy', 9.5)
          .attr('r', 4)
          .attr('fill', d.color);
      } else {
        // Draw a line for other legend items
        legendItem
          .append('line')
          .attr('x1', xOffset - 15)
          .attr('x2', xOffset)
          .attr('y1', 9.5)
          .attr('y2', 9.5)
          .attr('stroke', d.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', d.dashed ? '5,5' : '0');
      }

      const text = legendItem
        .append('text')
        .attr('x', xOffset - 20)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .attr('fill', '#ccc')
        .attr('font-size', '0.6em')
        .text(d.label);

      xOffset -= text.node()!.getBBox().width + 30;
    });
  }

  private fitMarginLeftForBigNumbers(value: number): void {
    const digits = value.toFixed().length;
    this.margin.left = DEFAULT_MARGIN_LEFT + digits * 6;
  }

  private getAppropriateTickCount(min: number, max: number): number {
    const range = Math.abs(max - min);
    if (range <= 5) return 5;
    if (range <= 10) return 6;
    return 8;
  }
}
