import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadUploadComponent } from './workload-upload.component';

describe('WorkloadUploadComponent', () => {
  let component: WorkloadUploadComponent;
  let fixture: ComponentFixture<WorkloadUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkloadUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
