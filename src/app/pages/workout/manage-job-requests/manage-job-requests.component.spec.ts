import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobRequestsComponent } from './manage-job-requests.component';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutTeamOutlookComponent } from '../components/workout-team-outlook/workout-team-outlook.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MockWorkoutTeamOutlookComponent } from '@src/app/mocks/components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';
import { DialogService } from '@src/app/services/dialog-service/dialog.service';
import { JobRequest } from '../../../shared/models/job-request.model';
import { signal, WritableSignal } from '@angular/core';
import { FiltersService, GeneralFilter } from '@src/app/services/filters/filters.service';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('ManageJobRequestsComponent', () => {
  let component: ManageJobRequestsComponent;
  let fixture: ComponentFixture<ManageJobRequestsComponent>;
  let mockFiltersService: Partial<FiltersService>;
  let mockParamsFilter: WritableSignal<string[]>;
  let mockJobRequestService: Partial<JobRequestService>;
  let mockDialogService: Partial<DialogService>;
  const mockJobRequests = signal<JobRequest[]>([]);
  const mockTotalJobRequests = signal<number>(0);

  const mockDialogRef = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    const jobRequestFilter = signal<GeneralFilter[]>([]);
    mockFiltersService = {
      paramsFilter: mockParamsFilter,
      getAllSiglumsHR: jest.fn(),
      jobRequestFilter: jobRequestFilter,
    };

    mockJobRequestService = {
      deleteJobRequest: jest.fn(),
      updateJobRequest: jest.fn(),
      jobRequests: mockJobRequests,
      totalJobRequests: mockTotalJobRequests,
    };

    mockDialogService = {
      openConfirmationDialog: jest.fn(),
    };

    TestBed.overrideComponent(ManageJobRequestsComponent, {
      remove: { imports: [WorkoutTeamOutlookComponent] },
      add: { imports: [MockWorkoutTeamOutlookComponent] },
    });

    await TestBed.configureTestingModule({
      imports: [ManageJobRequestsComponent, MockWorkoutTeamOutlookComponent, MatButtonModule, NoopAnimationsModule],
      providers: [
        MatDialogModule,
        { provide: JobRequestService, useValue: mockJobRequestService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: FiltersService, useValue: mockFiltersService },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageJobRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
