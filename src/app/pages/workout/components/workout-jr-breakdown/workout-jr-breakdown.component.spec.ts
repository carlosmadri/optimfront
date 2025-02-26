import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutJrBreakdownComponent } from './workout-jr-breakdown.component';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';
import { DonutChartComponent } from '@app/shared/graphs/donut-chart/donut-chart.component';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Signal, WritableSignal, signal } from '@angular/core';

describe('WorkoutJrBreakdownComponent', () => {
  let component: WorkoutJrBreakdownComponent;
  let fixture: ComponentFixture<WorkoutJrBreakdownComponent>;
  let mockFiltersService: Partial<FiltersService>;
  let mockJobRequestService: Partial<JobRequestService>;
  let mockParamsFilter: WritableSignal<string[]>;
  let mockSummaryType: WritableSignal<{ type: string; count: number }[]>;

  beforeEach(async () => {
    mockParamsFilter = signal<string[]>([]);
    mockSummaryType = signal<{ type: string; count: number }[]>([]);

    mockFiltersService = {
      paramsFilter: mockParamsFilter as Signal<string[]>,
    };

    mockJobRequestService = {
      getTypesSummary: jest.fn().mockResolvedValue(undefined),
      summaryType: mockSummaryType as Signal<{ type: string; count: number }[]>,
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutJrBreakdownComponent, DonutChartComponent, NgStyle, MatIconModule],
      providers: [
        { provide: FiltersService, useValue: mockFiltersService },
        { provide: JobRequestService, useValue: mockJobRequestService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutJrBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on initialization', () => {
    expect(mockJobRequestService.getTypesSummary).toHaveBeenCalledWith([]);
  });

  it('should map summary types correctly', () => {
    mockSummaryType.set([
      { type: 'Replacement', count: 5 },
      { type: 'Creation', count: 3 },
    ]);

    const mappedTypes = component.mappedSummaryTypes();

    expect(mappedTypes).toEqual([
      { type: 'Replacement', count: 5, color: '#00AEC7', icon: 'switch_account' },
      { type: 'Creation', count: 3, color: '#FF6B6B', icon: 'person_add_alt_1' },
      { type: 'Temporary Extension', count: 0, color: '#FFD93D', icon: 'more_time' },
      { type: 'Conversion', count: 0, color: '#FF8811', icon: 'published_with_changes' },
    ]);
  });

  it('should calculate types values correctly', () => {
    mockSummaryType.set([
      { type: 'Replacement', count: 5 },
      { type: 'Creation', count: 3 },
    ]);

    const typesValues = component.typesValues();

    expect(typesValues).toEqual([5, 3, 0, 0]);
  });

  it('should calculate total JRs correctly', () => {
    mockSummaryType.set([
      { type: 'Replacement', count: 5 },
      { type: 'Creation', count: 3 },
    ]);

    const totalJRs = component.totalJRs();

    expect(totalJRs).toBe('8.0');
  });

  it('should load data when filters change', () => {
    mockParamsFilter.set(['param1', 'param2']);

    // Trigger the effect
    fixture.detectChanges();

    expect(mockJobRequestService.getTypesSummary).toHaveBeenCalledWith(['param1', 'param2']);
  });
});
