import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal } from '@angular/core';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { LineChartComponent } from '@src/app/shared/graphs/line-chart/line-chart.component';
import { BorrowedLeased } from '@src/app/shared/models/borrowed-leased.model';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';

@Component({
  selector: 'optim-workout-borrowed-leased',
  standalone: true,
  imports: [LineChartComponent],
  templateUrl: './workout-borrowed-leased.component.html',
  styleUrl: './workout-borrowed-leased.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBorrowedLeasedComponent {
  private employeeService: EmployeeService = inject(EmployeeService);
  private filtersService: FiltersService = inject(FiltersService);

  borrowedLeased: Signal<BorrowedLeased | null> = this.employeeService.borrowedData;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.employeeService.getBorrowedLeased(params);
    });
  }

  borrowed = computed<string>(() => {
    const borrowedLeased = this.borrowedLeased();
    if (borrowedLeased?.averageBorrowed) {
      return borrowedLeased.averageBorrowed.toFixed(1);
    }
    return '0';
  });

  leased = computed<string>(() => {
    const borrowedLeased = this.borrowedLeased();
    if (borrowedLeased?.averageLeased) {
      return borrowedLeased.averageLeased.toFixed(1);
    }
    return '0';
  });

  balance = computed<string>(() => {
    const borrowedLeased = this.borrowedLeased();
    if (borrowedLeased?.netDifference) {
      return borrowedLeased.netDifference.toFixed(1);
    }
    return '0';
  });

  chartData = computed<LineChartData | null>(() => {
    const borrowedLeased = this.borrowedLeased();
    if (borrowedLeased?.chartData) {
      return borrowedLeased.chartData;
    }
    return null;
  });
}
