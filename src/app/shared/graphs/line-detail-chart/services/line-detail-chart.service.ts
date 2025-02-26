import { Injectable, ElementRef } from '@angular/core';
import { LineDetailChartData } from '@src/app/shared/models/graphs/line-detail-chart.model';
import * as d3 from 'd3';

const BLUE = '#00AEC7';
const YELLOW = '#FFE415';

@Injectable({
  providedIn: 'root',
})
export class LineDetailChartService {
  private svg!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private margin = { top: 30, right: 20, bottom: 100, left: 10 };
  private width = 0;
  private height = 0;
  private x!: d3.ScaleBand<string>;
  private y!: d3.ScaleLinear<number, number>;

  createChart(element: ElementRef, data: LineDetailChartData[]): void {
    // Clear existing SVG
    d3.select(element.nativeElement).select('svg').remove();

    const boundingRect = element.nativeElement.getBoundingClientRect();
    this.width = boundingRect.width - this.margin.left - this.margin.right;
    this.height = boundingRect.height - this.margin.top - this.margin.bottom;

    // Create new SVG
    this.svg = d3
      .select(element.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.updateChart(data);
  }

  private updateChart(data: LineDetailChartData[]): void {
    // X scale
    this.x = d3.scaleBand().range([0, this.width]).padding(0.1);
    this.x.domain(data.map((d) => d.name));

    // Y scale
    const maxValue = Math.max(...data.map((d) => d.khours));
    this.y = d3
      .scaleLinear()
      .range([this.height, 0])
      .domain([0, maxValue * 1.1]); // Add 10% padding on top

    // X axis (without labels)
    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3
          .axisBottom(this.x)
          .tickSize(0)
          .tickFormat(() => ''),
      )
      .call((g) => g.select('.domain').attr('stroke', '#cccccc')); // Make axis line light gray

    // X axis labels (program names)
    const labels = this.svg
      .selectAll('.x-axis-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', 5) // 5 pixels below X-axis
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('transform', (d) => `translate(${this.x(d.name)! + this.x.bandwidth() / 2},${this.height + 5}) rotate(90)`)
      .style('font-size', '0.8em')
      .style('fill', 'white');

    labels.each(function (d) {
      const text = d3.select(this);
      const words = d.name.split(/\s+/);
      let line: string[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy') || '0');
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 5)
        .attr('y', y)
        .attr('dy', dy + 'em');

      for (const word of words) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((tspan.node() as SVGTextContentElement).getComputedTextLength() > 80) {
          // Adjust this value as needed
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', 5)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });

    // Line for kHours
    const lineKHours = d3
      .line<LineDetailChartData>()
      .x((d) => this.x(d.name)! + this.x.bandwidth() / 2)
      .y((d) => this.y(d.khours));

    this.svg.append('path').datum(data).attr('fill', 'none').attr('stroke', BLUE).attr('stroke-width', 2).attr('d', lineKHours);

    // Dots for kHours
    this.svg
      .selectAll('.dot-khours')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot-khours')
      .attr('cx', (d) => this.x(d.name)! + this.x.bandwidth() / 2)
      .attr('cy', (d) => this.y(d.khours))
      .attr('r', 5)
      .attr('fill', (d) => (d.selected ? YELLOW : BLUE));

    // Labels for kHours values
    this.svg
      .selectAll('.label-khours')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label-khours')
      .attr('x', (d) => this.x(d.name)! + this.x.bandwidth() / 2)
      .attr('y', (d) => this.y(d.khours) - 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '0.8em')
      .style('fill', 'white')
      .text((d) => d.khours);
  }
}
