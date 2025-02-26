import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkloadComponent } from './manage-workload.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockWorkloadPreviewComponent } from '@src/app/mocks/components/workload-preview-mock.component';
import { WorkloadPreviewComponent } from '../components/workload-preview/workload-preview.component';
import { WorkloadStatusComponent } from '../components/workload-status/workload-status.component';
import { MockWorkloadStatusComponent } from '@src/app/mocks/components/workload-status-mock.component';
import { WorkloadSubmissionComponent } from '../components/workload-submission/workload-submission.component';
import { MockWorkloadSubmissionComponent } from '@src/app/mocks/components/workload-submission-mock.component';

describe('ManageWorkloadComponent', () => {
  let component: ManageWorkloadComponent;
  let fixture: ComponentFixture<ManageWorkloadComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(ManageWorkloadComponent, {
      remove: {
        imports: [WorkloadPreviewComponent, WorkloadStatusComponent, WorkloadSubmissionComponent],
      },
      add: {
        imports: [MockWorkloadPreviewComponent, MockWorkloadStatusComponent, MockWorkloadSubmissionComponent],
      },
    });
    await TestBed.configureTestingModule({
      imports: [ManageWorkloadComponent, MockWorkloadPreviewComponent, MockWorkloadStatusComponent, MockWorkloadSubmissionComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageWorkloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
