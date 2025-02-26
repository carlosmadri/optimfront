import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksyncComponent } from './worksync.component';
import { WorksyncOwnSubComponent } from './components/worksync-own-sub/worksync-own-sub.component';
import { MockWorksyncOwnSubComponent } from '@src/app/mocks/components/worksync-own-sub-mock.component';
import { WorkloadPerProgramComponent } from './components/workload-per-program/workload-per-program.component';
import { MockWorkloadPerProgramComponent } from '@src/app/mocks/components/workload-per-program-mock.component';
import { WorksyncDirectIndirectComponent } from './components/worksync-direct-indirect/worksync-direct-indirect.component';
import { MockWorksyncDirectIndirectComponent } from '@src/app/mocks/components/worksync-direct-indirect-mock.component';
import { MockWorkloadEvolutionComponent } from '@src/app/mocks/components/workload-evolution-mock.component';
import { WorkloadEvolutionComponent } from './components/workload-evolution/workload-evolution.component';
import { WorkoutMonthlyDistributionComponent } from '../workout/components/workout-monthly-distribution/workout-monthly-distribution.component';
import { MockWorkoutMonthlyDistributionComponent } from '@src/app/mocks/components';
import { WorkloadWorkforceComponent } from './components/workload-workforce/workload-workforce.component';
import { MockWorkloadWorkforceComponent } from '@src/app/mocks/components/worksync-workload-workforce-mock.component';
import { WorkloadStatusComponent } from './components/workload-status/workload-status.component';
import { WorkloadSubmissionComponent } from './components/workload-submission/workload-submission.component';
import { MockWorkloadStatusComponent } from '@src/app/mocks/components/workload-status-mock.component';
import { MockWorkloadSubmissionComponent } from '@src/app/mocks/components/workload-submission-mock.component';

describe('WorksyncComponent', () => {
  let component: WorksyncComponent;
  let fixture: ComponentFixture<WorksyncComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(WorksyncComponent, {
      remove: {
        imports: [
          WorkloadStatusComponent,
          WorkloadSubmissionComponent,
          WorksyncDirectIndirectComponent,
          WorksyncOwnSubComponent,
          WorkloadPerProgramComponent,
          WorkloadEvolutionComponent,
          WorkoutMonthlyDistributionComponent,
          WorkloadWorkforceComponent,
        ],
      },
      add: {
        imports: [
          MockWorkloadStatusComponent,
          MockWorkloadSubmissionComponent,
          MockWorksyncDirectIndirectComponent,
          MockWorksyncOwnSubComponent,
          MockWorkloadPerProgramComponent,
          MockWorkloadEvolutionComponent,
          MockWorkoutMonthlyDistributionComponent,
          MockWorkloadWorkforceComponent,
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        WorksyncComponent,
        MockWorkloadStatusComponent,
        MockWorkloadSubmissionComponent,
        MockWorksyncDirectIndirectComponent,
        MockWorksyncOwnSubComponent,
        MockWorkloadPerProgramComponent,
        MockWorkloadEvolutionComponent,
        MockWorkoutMonthlyDistributionComponent,
        MockWorkloadWorkforceComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
