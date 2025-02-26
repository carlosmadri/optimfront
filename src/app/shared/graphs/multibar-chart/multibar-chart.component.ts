import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, Injector, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WorkloadEvolutionBarData } from '../../models/worksync.model';
import { MultibarChartService } from './services/multibar-chart.service';
import { ExerciseColorService } from './services/exercise-color.service';

@Component({
  selector: 'optim-multibar-chart',
  standalone: true,
  imports: [],
  templateUrl: './multibar-chart.component.html',
  styleUrl: './multibar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MultibarChartService, ExerciseColorService],
})
export class MultibarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart') chart!: ElementRef;

  chartData = input.required<WorkloadEvolutionBarData[]>();

  chartService = inject(MultibarChartService);
  colorService = inject(ExerciseColorService);
  private injector = inject(Injector);

  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit(): void {
    effect(
      () => {
        if (this.chartData()) {
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

    const exerciseNames = data.map((d) => d.exercise);
    const barTypes = data.map((d) => d.barType);
    const colorMap = this.colorService.getColorMap(barTypes, exerciseNames);

    this.chartService.setColorMap(colorMap);

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
