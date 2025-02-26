import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutTeamOutlookComponent } from './workout-team-outlook.component';
import { signal, WritableSignal } from '@angular/core';
import { TeamOutlook } from '@app/shared/models/team-outlook.model';
import { TeamOutlookService } from '@app/services/team-outlook/team-outlook.service';
import { FiltersService } from '@app/services/filters/filters.service';

describe('WorkoutTeamOutlookComponent', () => {
  let component: WorkoutTeamOutlookComponent;
  let fixture: ComponentFixture<WorkoutTeamOutlookComponent>;
  let mockTeamOutlookService: Partial<TeamOutlookService>;
  let mockFiltersService: Partial<FiltersService>;

  beforeEach(async () => {
    mockTeamOutlookService = {
      teamOutlook: signal<TeamOutlook | null>(null),
      getTeamOutlook: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: TeamOutlookService, useValue: mockTeamOutlookService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutTeamOutlookComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should initialize teamOutlookData with the service's teamOutlook signal", () => {
    expect(component['teamOutlookData']).toBe(mockTeamOutlookService.teamOutlook);
  });

  it('should call getTeamOutlook on initialization with empty params', () => {
    fixture.detectChanges();
    expect(mockTeamOutlookService.getTeamOutlook).toHaveBeenCalledWith([]);
  });

  it('should call getTeamOutlook when paramsFilter changes', () => {
    const newParams = ['param1=value1', 'param2=value2'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(newParams);

    fixture.detectChanges();

    expect(mockTeamOutlookService.getTeamOutlook).toHaveBeenCalledWith(newParams);
  });

  it('should handle errors when getTeamOutlook fails', async () => {
    const error = new Error('Test error');
    (mockTeamOutlookService.getTeamOutlook as jest.Mock).mockRejectedValue(error);

    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(['error=true']);

    fixture.detectChanges();

    await expect(mockTeamOutlookService.getTeamOutlook).rejects.toThrow('Test error');
  });

  it('should call getTeamOutlook multiple times for different paramsFilter values', () => {
    const params1 = ['param1=value1'];
    const params2 = ['param2=value2'];

    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(params1);
    fixture.detectChanges();
    expect(mockTeamOutlookService.getTeamOutlook).toHaveBeenCalledWith(params1);

    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(params2);
    fixture.detectChanges();
    expect(mockTeamOutlookService.getTeamOutlook).toHaveBeenCalledWith(params2);

    expect(mockTeamOutlookService.getTeamOutlook).toHaveBeenCalledTimes(2);
  });
});
