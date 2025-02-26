import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutFteLocationComponent } from './workout-fte-location.component';
import { LocationService } from '@src/app/services/location/location.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { MapGraphComponent } from '@app/shared/graphs/map-graph/map-graph.component';
import { NO_ERRORS_SCHEMA, Signal, signal, WritableSignal } from '@angular/core';
import { MockMapGraphComponent } from '@src/app/mocks/components';
import { MapData } from '@src/app/shared/models/graphs/map-charts.model';

describe('WorkoutFteLocationComponent', () => {
  let component: WorkoutFteLocationComponent;
  let fixture: ComponentFixture<WorkoutFteLocationComponent>;
  let mockFiltersService: Partial<FiltersService>;
  let mockLocationService: Partial<LocationService>;
  let mockParamsFilter: WritableSignal<string[]>;
  let mockFteLocations: WritableSignal<MapData[]>;

  beforeEach(async () => {
    mockParamsFilter = signal<string[]>([]);
    mockFteLocations = signal<MapData[]>([]);

    mockFiltersService = {
      paramsFilter: mockParamsFilter as Signal<string[]>,
    };

    mockLocationService = {
      getFTEsLocations: jest.fn().mockResolvedValue([]),
      fteLocations: mockFteLocations as Signal<MapData[]>,
    };

    TestBed.overrideComponent(WorkoutFteLocationComponent, {
      remove: {
        imports: [MapGraphComponent],
      },
      add: {
        imports: [MockMapGraphComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkoutFteLocationComponent, MockMapGraphComponent],
      providers: [
        { provide: LocationService, useValue: mockLocationService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockParamsFilter.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData when FiltersService paramsFilter changes', async () => {
    const loadDataSpy = jest.spyOn(component, 'loadData');
    const newParams = ['param1', 'param2'];
    mockParamsFilter.set(newParams);

    TestBed.flushEffects();

    expect(loadDataSpy).toHaveBeenCalledWith(newParams);
  });

  describe('loadData', () => {
    it('should call getFTEsLocations with provided params', async () => {
      const params = ['param1', 'param2'];
      await component.loadData(params);
      expect(mockLocationService.getFTEsLocations).toHaveBeenCalledWith(params);
    });

    it('should call getFTEsLocations without params if none provided', async () => {
      await component.loadData();
      expect(mockLocationService.getFTEsLocations).toHaveBeenCalledWith(undefined);
    });
  });
});
