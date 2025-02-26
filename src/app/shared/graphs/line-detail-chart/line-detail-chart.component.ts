import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LineDetailChartData } from '../../models/graphs/line-detail-chart.model';
import { LineDetailChartService } from './services/line-detail-chart.service';

@Component({
  selector: 'optim-line-detail-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-detail-chart.component.html',
  styleUrl: './line-detail-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineDetailChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  chartData = input<LineDetailChartData[]>([]);

  lineDetailChartService: LineDetailChartService = inject(LineDetailChartService);

  constructor() {
    effect(() => {
      const data = this.chartData();
      if (data.length > 0) {
        this.createChart(data);
      }
    });
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit() {
    const data = this.chartData();
    if (data.length > 0) {
      this.createChart(data);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private createChart(data: LineDetailChartData[]) {
    this.lineDetailChartService.createChart(this.chartContainer, data);
  }

  private onResize() {
    const data = this.chartData();
    if (data.length > 0) {
      this.createChart(data);
    }
  }
}
