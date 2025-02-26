import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { WorkloadWorkforce } from '../../models/worksync.model';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  NgApexchartsModule,
  ApexYAxis,
  ApexGrid,
  ApexTheme,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexOptions,
} from 'ng-apexcharts';

export interface ChartOptions {
  theme: ApexTheme;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
}

@Component({
  selector: 'optim-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  chartData = input<WorkloadWorkforce[]>();
  containerHeight = input<number>();
  public chartOptions = signal<Partial<ApexOptions> | null>(null);

  constructor() {
    effect(
      () => {
        if (!this.chartData() || this.chartData()!.length === 0 || this.containerHeight() === 0) {
          this.chartOptions.set(null);
        } else {
          this.setChartOptions();
        }
      },
      { allowSignalWrites: true },
    );
  }

  setChartOptions(): void {
    const labels = this.chartData()!.map((data) => data.label);
    const values = this.chartData()!.map((data) => data.value);
    const colors = this.chartData()!.map((data) => data.color);
    const chartOptions: ChartOptions = {
      theme: {
        mode: 'dark',
      },
      series: [
        {
          data: values,
        },
      ],
      chart: {
        height: this.containerHeight(),
        type: 'bar',
        background: '#1f2a3f',
        foreColor: '#cccccc',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: labels,
        labels: {
          style: {
            colors: '#cccccc',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#cccccc',
          },
        },
      },
      grid: {
        borderColor: '#555555',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
      },
      colors: colors,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };

    this.chartOptions.set(chartOptions);
  }
}
