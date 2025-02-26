import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadSubmissionComponent } from './workload-submission.component';

describe('WorkloadSubmissionComponent', () => {
  let component: WorkloadSubmissionComponent;
  let fixture: ComponentFixture<WorkloadSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadSubmissionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
