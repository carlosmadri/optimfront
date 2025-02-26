import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { WorkloadSubmissionStatus, WorkloadValidationStatus } from '@src/app/shared/models/worksync.model';

@Component({
  selector: 'optim-workload-status',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './workload-status.component.html',
  styleUrl: './workload-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadStatusComponent {
  private filtersService: FiltersService = inject(FiltersService);
  private worksyncService: WorksyncService = inject(WorksyncService);

  protected readonly evolutionData = this.worksyncService.evolution;

  private currentParams: string[] | undefined;

  requestStatus = input<boolean>(false);

  workloadSubmissionStatus = WorkloadSubmissionStatus;
  workloadValidationStatus = WorkloadValidationStatus;

  checked = false;

  constructor() {
    effect(() => {
      this.currentParams = this.filtersService.paramsFilter();
      if (this.requestStatus()) {
        this.loadData(this.currentParams);
      }
    });
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getWorkLoadEvolution(params);
  }

  submissionStatus = computed<WorkloadSubmissionStatus | undefined>(() => {
    const evolutionData = this.evolutionData();
    return evolutionData ? evolutionData.submissionStatus : undefined;
  });

  validationStatus = computed<WorkloadValidationStatus | undefined>(() => {
    const evolutionData = this.evolutionData();
    return evolutionData ? evolutionData.validationStatus : undefined;
  });
}
