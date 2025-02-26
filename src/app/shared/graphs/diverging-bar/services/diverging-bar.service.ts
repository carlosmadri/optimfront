import { Injectable } from '@angular/core';
import { LeversTotal } from '@app/shared/models/levers-total.model';
import * as d3 from 'd3';
import { Selection } from 'd3-selection';

@Injectable()
export class DivergingBarService {
  private svg: Selection<SVGGElement, unknown, null, undefined> | undefined;
  private margin = { top: 0, right: 15, bottom: 10, left: 15 };
  private width!: number;
  private height!: number;
  private minBarHeight = 20;
  private barPadding = 0.1;
  private x!: d3.ScaleLinear<number, number>;
  private y!: d3.ScaleBand<string>;

  hasChart(): boolean {
    return !!this.svg;
  }

  createChart(element: HTMLElement, data: LeversTotal[]): void {
    this.createSvg(element, data);
    this.createScales(data);
    this.drawBars(data);
  }

  updateChart(data: LeversTotal[]): void {
    this.createScales(data);
    this.drawBars(data);
  }

  resizeChart(element: HTMLElement, data: LeversTotal[]): void {
    this.createSvg(element, data);
    this.createScales(data);
    this.drawBars(data);
  }

  destroyChart(): void {
    if (this.svg) {
      const svgElement = this.svg.node()?.parentElement;
      if (svgElement && svgElement.parentNode) {
        svgElement.parentNode.removeChild(svgElement);
      }
      this.svg = undefined;
    }
  }

  private createSvg(element: HTMLElement, data: LeversTotal[]): void {
    d3.select(element).selectAll('*').remove();

    const containerWidth = element.clientWidth || 300; // Fallback width
    const containerHeight = element.clientHeight || 200; // Fallback height
    this.width = containerWidth - this.margin.left - this.margin.right;

    const totalBarHeight = this.minBarHeight * data.length;
    const totalPaddingHeight = this.minBarHeight * this.barPadding * (data.length - 1);
    const calculatedHeight = totalBarHeight + totalPaddingHeight;

    this.height = Math.max(calculatedHeight, containerHeight - this.margin.top - this.margin.bottom);

    const totalHeight = this.height + this.margin.top + this.margin.bottom;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private createScales(data: LeversTotal[]): void {
    const maxAbsValue = d3.max(data, (d) => Math.abs(d.totalAmount))!;

    this.x = d3.scaleLinear().domain([-maxAbsValue, maxAbsValue]).range([0, this.width]);

    // Create a unique identifier for each data point
    const uniqueData = data.map((d, i) => ({ ...d, id: `${d.leverType}-${i}` }));

    this.y = d3
      .scaleBand()
      .range([0, this.height])
      .domain(uniqueData.map((d) => d.id))
      .padding(this.barPadding);

    if (this.y.bandwidth() < this.minBarHeight) {
      const totalPadding = this.height * this.barPadding;
      const availableHeight = this.height - totalPadding;
      const newBandwidth = availableHeight / uniqueData.length;

      this.y = d3
        .scaleBand()
        .range([0, this.height])
        .domain(uniqueData.map((d) => d.id))
        .padding((this.height - newBandwidth * uniqueData.length) / (this.height * uniqueData.length));
    }
  }

  private drawBars(data: LeversTotal[]): void {
    if (!this.svg || data.length === 0) return;

    const labelFontSize = data.length < 6 ? '13px' : '11px';

    this.svg.selectAll('*').remove();

    // Create a unique identifier for each data point
    const uniqueData = data.map((d, i) => ({ ...d, id: `${d.leverType}-${i}` }));

    // Draw bars
    this.svg
      .selectAll('myRect')
      .data(uniqueData)
      .join('rect')
      .attr('x', (d) => (d.totalAmount < 0 ? this.x(d.totalAmount) : this.x(0)))
      .attr('y', (d) => this.y(d.id)!)
      .attr('width', (d) => Math.abs(this.x(d.totalAmount) - this.x(0)))
      .attr('height', this.y.bandwidth())
      .attr('fill', (d) => (d.totalAmount >= 0 ? '#0085AD' : '#FF6B6B'));

    // Draw labels
    const threshold = d3.max(uniqueData, (d) => Math.abs(d.totalAmount))! * 0.6;
    this.svg
      .selectAll('.totalAmount')
      .data(uniqueData)
      .join('text')
      .attr('class', 'totalAmount')
      .attr('x', (d) => {
        if (Math.abs(d.totalAmount) >= threshold) {
          return d.totalAmount < 0 ? this.x(d.totalAmount) + 5 : this.x(d.totalAmount) - 5;
        } else {
          return d.totalAmount < 0 ? this.x(d.totalAmount) - 5 : this.x(d.totalAmount) + 5;
        }
      })
      .attr('y', (d) => this.y(d.id)! + this.y.bandwidth() / 2)
      .attr('dy', '0.3em')
      .attr('text-anchor', (d) => {
        if (Math.abs(d.totalAmount) >= threshold) {
          return d.totalAmount < 0 ? 'start' : 'end';
        } else {
          return d.totalAmount < 0 ? 'end' : 'start';
        }
      })
      .attr('fill', 'white')
      .attr('font-size', labelFontSize)
      .text((d) => d.totalAmount.toFixed(1).replace('.', ','));

    this.svg
      .selectAll('.leverType')
      .data(uniqueData)
      .join('text')
      .attr('class', 'leverType')
      .attr('x', (d) => (d.totalAmount < 0 ? this.x(0) + 5 : this.x(0) - 5))
      .attr('y', (d) => this.y(d.id)! + this.y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.totalAmount < 0 ? 'start' : 'end'))
      .attr('fill', '#c1c9d4')
      .attr('font-size', labelFontSize)
      .text((d) => d.leverType);
  }
}
