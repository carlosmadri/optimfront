import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { WorksyncOwnSubComponent } from './components/worksync-own-sub/worksync-own-sub.component';
import { WorkloadPerProgramComponent } from './components/workload-per-program/workload-per-program.component';
import { WorksyncDirectIndirectComponent } from './components/worksync-direct-indirect/worksync-direct-indirect.component';
import { WorkloadEvolutionComponent } from './components/workload-evolution/workload-evolution.component';
import { WorkoutMonthlyDistributionComponent } from '../workout/components/workout-monthly-distribution/workout-monthly-distribution.component';
import { ChartSelectorComponent } from '@src/app/shared/components/chart-selector/chart-selector.component';
import { WorkloadWorkforceComponent } from './components/workload-workforce/workload-workforce.component';
import { WorkloadStatusComponent } from './components/workload-status/workload-status.component';
import { WorkloadSubmissionComponent } from './components/workload-submission/workload-submission.component';

@Component({
  selector: 'optim-worksync',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    WorkloadStatusComponent,
    WorkloadSubmissionComponent,
    WorksyncDirectIndirectComponent,
    WorksyncOwnSubComponent,
    WorkloadPerProgramComponent,
    WorkloadEvolutionComponent,
    WorkoutMonthlyDistributionComponent,
    WorkloadWorkforceComponent,
    ChartSelectorComponent,
  ],
  templateUrl: './worksync.component.html',
  styleUrl: './worksync.component.scss',
})
export class WorksyncComponent {}
