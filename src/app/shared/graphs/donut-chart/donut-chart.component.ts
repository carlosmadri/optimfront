import { ChangeDetectionStrategy, Component, effect, ElementRef, input, OnDestroy, OnInit, signal } from '@angular/core';
import { DonutChartService } from './services/donut-chart.service';

@Component({
  selector: 'optim-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DonutChartService],
})
export class DonutChartComponent implements OnInit, OnDestroy {
  data = input.required<number[]>();
  colors = input<string[]>([]);
  title = input<string>();
  subtitle = input<string>();
  titleColor = input<string>();
  subtitleColor = input<string>();

  private chartElement = signal<HTMLElement | null>(null);

  constructor(
    private el: ElementRef,
    private donutChartService: DonutChartService,
  ) {
    effect(() => {
      if (this.chartElement() && this.donutChartService.hasChart() && this.data()) {
        this.updateChart();
      }
    });
  }

  ngOnInit() {
    this.chartElement.set(this.el.nativeElement.querySelector('div'));
    if (this.chartElement()) {
      this.updateChart(true);
    } else {
      console.warn('Chart element not found');
    }
  }

  ngOnDestroy() {
    this.donutChartService.destroyChart();
  }

  private updateChart(initialize = false) {
    if (initialize && this.chartElement()) {
      this.donutChartService.createChart(this.chartElement()!, this.titleColor(), this.subtitleColor());
    }
    this.donutChartService.updateChart(this.data(), this.colors(), this.title(), this.subtitle());
  }
}
