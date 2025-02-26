import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WorkoutLeversEoyComponent } from './workout-levers-eoy.component';
import { LeversService } from '@app/services/levers/levers.service';
import { NO_ERRORS_SCHEMA, signal, WritableSignal } from '@angular/core';
import { LeversTotal } from '@app/shared/models/levers-total.model';
import { FiltersService } from '@app/services/filters/filters.service';
import { MockDivergingBarComponent } from '@src/app/mocks/components/divergin-bar-mock.component';
import { DivergingBarComponent } from '@src/app/shared/graphs/diverging-bar/diverging-bar.component';

describe('WorkoutLeversEoyComponent', () => {
  let component: WorkoutLeversEoyComponent;
  let fixture: ComponentFixture<WorkoutLeversEoyComponent>;

  const mockLeversService: Partial<LeversService> = {
    getTotalByEoY: jest.fn(),
    totalByEoY: signal<LeversTotal[]>([]) as WritableSignal<LeversTotal[]>,
  };

  const mockFiltersService: Partial<FiltersService> = {
    paramsFilter: signal([]) as WritableSignal<string[]>,
  };

  beforeEach(async () => {
    TestBed.overrideComponent(WorkoutLeversEoyComponent, {
      remove: {
        imports: [DivergingBarComponent],
      },
      add: {
        imports: [MockDivergingBarComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkoutLeversEoyComponent, MockDivergingBarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LeversService, useValue: mockLeversService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutLeversEoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTotalByEoY with params from paramsFilter', fakeAsync(() => {
    const params = ['someParam=value'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(params);
    tick();
    expect(mockLeversService.getTotalByEoY).toHaveBeenCalledWith(params);
  }));

  it('should sort totalByEoY in descending order by leverType', () => {
    const mockData: LeversTotal[] = [
      { leverType: 'b', totalAmount: 300 },
      { leverType: 'c', totalAmount: 200 },
      { leverType: 'a', totalAmount: 100 },
    ];
    (mockLeversService.totalByEoY as WritableSignal<LeversTotal[]>).set(mockData);

    const sortedData = component.sortedTotalByEoY();

    expect(sortedData).toEqual([
      { leverType: 'a', totalAmount: 100 },
      { leverType: 'b', totalAmount: 300 },
      { leverType: 'c', totalAmount: 200 },
    ]);
  });

  it('should return an empty array if totalByEoY is empty', () => {
    (mockLeversService.totalByEoY as WritableSignal<LeversTotal[]>).set([]);

    const sortedData = component.sortedTotalByEoY();

    expect(sortedData).toEqual([]);
  });
});
