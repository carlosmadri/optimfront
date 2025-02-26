import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';

@Component({
  selector: 'optim-workload-preview',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './workload-preview.component.html',
  styleUrl: './workload-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadPreviewComponent {
  private filtersService: FiltersService = inject(FiltersService);
  private worksyncService: WorksyncService = inject(WorksyncService);

  protected readonly previewData = this.worksyncService.workloadPreview;

  constructor() {
    effect(() => {
      const params = this.filtersService.paramsFilter();
      this.loadData(params);
    });
  }

  async loadData(params?: string[]) {
    await this.worksyncService.getWorkloadPreview(params);
  }
}
