import { TestBed } from '@angular/core/testing';
import { FilterYearComponent } from './filter-year.component';
import { FiltersService } from '@app/services/filters/filters.service';
import { signal, WritableSignal } from '@angular/core';

describe('FilterYearComponent', () => {
  let component: FilterYearComponent;
  let filtersService: FiltersService;
  const filtersServiceMock = {
    yearFilter: signal(2023) as WritableSignal<number>,
    setYearFilter: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterYearComponent],
      providers: [{ provide: FiltersService, useValue: filtersServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(FilterYearComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (filtersServiceMock.yearFilter as WritableSignal<number>).set(2023);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentYear, minYear, and maxYear on ngOnInit', () => {
    component.ngOnInit();
    expect(component.currentYear).toBe(2023);
    expect(component.minYear).toBe(2022);
    expect(component.maxYear).toBe(2028);
  });

  it('should call setYearFilter with the previous year if current year is greater than minYear', () => {
    component.ngOnInit();
    component.previous();
    expect(filtersService.setYearFilter).toHaveBeenCalledWith(2022);
  });

  it('should not call setYearFilter with the previous year if current year is equal to minYear', () => {
    (filtersServiceMock.yearFilter as WritableSignal<number>).set(2023);
    component.ngOnInit();

    (filtersServiceMock.yearFilter as WritableSignal<number>).set(2022);
    component.previous();

    expect(filtersService.setYearFilter).not.toHaveBeenCalled();
  });

  it('should call setYearFilter with the next year if current year is less than maxYear', () => {
    component.ngOnInit();
    component.next();
    expect(filtersService.setYearFilter).toHaveBeenCalledWith(2024);
  });

  it('should not call setYearFilter with the next year if current year is equal to maxYear', () => {
    component.ngOnInit();
    (filtersServiceMock.yearFilter as WritableSignal<number>).set(2028);

    component.next();
    expect(filtersService.setYearFilter).not.toHaveBeenCalled();
  });
});
