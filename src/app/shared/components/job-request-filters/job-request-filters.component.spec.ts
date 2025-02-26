import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestFiltersComponent } from './job-request-filters.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('JobRequestFiltersComponent', () => {
  let component: JobRequestFiltersComponent;
  let fixture: ComponentFixture<JobRequestFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobRequestFiltersComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobRequestFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
