import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadPreviewComponent } from './workload-preview.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { signal } from '@angular/core';
import { WorkloadPreview } from '@src/app/shared/models/worksync.model';

describe('WorkloadPreviewComponent', () => {
  let component: WorkloadPreviewComponent;
  let fixture: ComponentFixture<WorkloadPreviewComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  beforeEach(async () => {
    mockWorksyncService = {
      workloadPreview: signal<WorkloadPreview | null>(null),
      getWorkloadPreview: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };
    await TestBed.configureTestingModule({
      imports: [WorkloadPreviewComponent],
      providers: [
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
