import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent } from './donut-chart.component';
import { DonutChartService } from './services/donut-chart.service';
import { ElementRef } from '@angular/core';

describe('DonutChartComponent', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;
  let donutChartServiceMock: jest.Mocked<DonutChartService>;
  let elementRefMock: Partial<ElementRef>;

  class MockDonutChartServiceMock implements Partial<DonutChartService> {
    createChart = jest.fn();
    updateChart = jest.fn();
    hasChart = jest.fn();
    destroyChart = jest.fn();
  }

  beforeEach(async () => {
    donutChartServiceMock = new MockDonutChartServiceMock() as unknown as jest.Mocked<DonutChartService>;

    elementRefMock = {
      nativeElement: {
        querySelector: jest.fn().mockReturnValue(document.createElement('div')),
      },
    };

    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
      providers: [{ provide: ElementRef, useValue: elementRefMock }],
    })
      .overrideComponent(DonutChartComponent, {
        set: {
          providers: [{ provide: DonutChartService, useValue: donutChartServiceMock }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart on ngOnInit', () => {
    const createSpy = jest.spyOn(donutChartServiceMock, 'createChart');
    const updateSpy = jest.spyOn(donutChartServiceMock, 'updateChart');
    donutChartServiceMock.hasChart.mockReturnValue(false);
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();

    component.ngOnInit();

    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should update chart when data changes and chart exists', () => {
    donutChartServiceMock.hasChart.mockReturnValue(true);

    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();

    expect(donutChartServiceMock.updateChart).toHaveBeenCalledTimes(2); // Once on init, once on data change
  });

  it('should destroy chart on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(donutChartServiceMock.destroyChart).toHaveBeenCalled();
  });

  it('should update chart with correct parameters', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();

    fixture.componentRef.setInput('colors', ['red', 'green', 'blue']);
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');

    fixture.detectChanges();

    component.ngOnInit();
    expect(donutChartServiceMock.updateChart).toHaveBeenCalledWith([1, 2, 3], ['red', 'green', 'blue'], 'Test Title', 'Test Subtitle');
  });

  it('should create chart with correct title and subtitle colors', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();

    fixture.componentRef.setInput('titleColor', 'black');
    fixture.componentRef.setInput('subtitleColor', 'gray');

    fixture.detectChanges();
    component.ngOnInit();

    expect(donutChartServiceMock.createChart).toHaveBeenCalledWith(expect.any(HTMLElement), 'black', 'gray');
  });
});
