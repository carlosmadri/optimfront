import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { EmployeeService } from '@src/app/services/employee/employee.service';
import { FiltersService } from '@src/app/services/filters/filters.service';

@Component({
  selector: 'optim-workout-nawf-breakdown',
  standalone: true,
  imports: [],
  templateUrl: './workout-nawf-breakdown.component.html',
  styleUrl: './workout-nawf-breakdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutNawfBreakdownComponent {
  private employeeService: EmployeeService = inject(EmployeeService);
  private filtersService: FiltersService = inject(FiltersService);

  protected readonly summaryNAWF = this.employeeService.summaryNAWF;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.employeeService.getSummaryNAWF(params);
  }

  sortedSummaryNAWF = computed(() => {
    return this.summaryNAWF().sort((a, b) => b.employeeCount - a.employeeCount);
  });
}
