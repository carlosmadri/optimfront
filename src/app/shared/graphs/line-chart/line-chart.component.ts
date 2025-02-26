import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, effect, input } from '@angular/core';
import { LineChartService } from './services/line-chart.service';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';

@Component({
  selector: 'optim-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LineChartService],
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  lineChartData = input<LineChartData | null>(null);

  lineChartService: LineChartService = inject(LineChartService);

  constructor() {
    effect(() => {
      const chartData = this.lineChartData();
      if (chartData) {
        this.createChart(chartData);
      }
    });
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit() {
    const chartData = this.lineChartData();
    if (chartData) {
      this.createChart(chartData);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private createChart(chartData: LineChartData) {
    this.lineChartService.createChart(this.chartContainer, chartData);
  }

  private onResize() {
    const chartData = this.lineChartData();
    if (chartData) {
      this.createChart(chartData);
    }
  }
}
