import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, Injector, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LeversTotal } from '@app/shared/models/levers-total.model';
import { DivergingBarService } from './services/diverging-bar.service';

@Component({
  selector: 'optim-diverging-bar',
  standalone: true,
  imports: [],
  templateUrl: './diverging-bar.component.html',
  styleUrl: './diverging-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DivergingBarService],
})
export class DivergingBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart') chart!: ElementRef;

  chartData = input.required<LeversTotal[]>();

  private chartService = inject(DivergingBarService);
  private injector = inject(Injector);

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit(): void {
    effect(
      () => {
        if (this.chartData().length) {
          this.updateChart();
        } else {
          this.chartService.destroyChart();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  private updateChart(): void {
    const chartElement = this.chart.nativeElement;
    const data = this.chartData();

    if (this.chartService.hasChart()) {
      this.chartService.updateChart(data);
    } else {
      this.chartService.createChart(chartElement, data);
    }
  }

  private onResize(): void {
    const chartElement = this.chart.nativeElement;
    const data = this.chartData();
    this.chartService.resizeChart(chartElement, data);
  }

  ngOnDestroy(): void {
    this.chartService.destroyChart();
    window.removeEventListener('resize', this.onResize);
  }
}
