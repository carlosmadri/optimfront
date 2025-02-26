import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDetailChartComponent } from './line-detail-chart.component';
import { LineDetailChartService } from './services/line-detail-chart.service';
import { LineDetailChartData } from '../../models/graphs/line-detail-chart.model';

describe('LineDetailChartComponent', () => {
  let component: LineDetailChartComponent;
  let fixture: ComponentFixture<LineDetailChartComponent>;
  let mockLineDetailChartService: jest.Mocked<LineDetailChartService>;

  beforeEach(async () => {
    class MockLineDetailChartService implements Partial<LineDetailChartService> {
      createChart = jest.fn();
    }

    mockLineDetailChartService = new MockLineDetailChartService() as unknown as jest.Mocked<LineDetailChartService>;

    await TestBed.configureTestingModule({
      imports: [LineDetailChartComponent],
      providers: [{ provide: LineDetailChartService, useValue: mockLineDetailChartService }],
    })
      .overrideComponent(LineDetailChartComponent, {
        set: {
          providers: [{ provide: LineDetailChartService, useValue: mockLineDetailChartService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LineDetailChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChart when chartData is set', () => {
    const mockChartData: LineDetailChartData[] = [{ name: 'Test', khours: 10, programs: 5, selected: false }];
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineDetailChartData[]) => void }, 'createChart');

    fixture.componentRef.setInput('chartData', mockChartData);
    fixture.detectChanges();

    expect(createChartSpy).toHaveBeenCalledWith(mockChartData);
  });

  it('should add resize event listener on init', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    component.ngOnInit();
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove resize event listener on destroy', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    component.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should create chart after view init if data is available', () => {
    const mockChartData: LineDetailChartData[] = [{ name: 'Test', khours: 10, programs: 5, selected: false }];
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineDetailChartData[]) => void }, 'createChart');

    fixture.componentRef.setInput('chartData', mockChartData);
    component.ngAfterViewInit();

    expect(createChartSpy).toHaveBeenCalledWith(mockChartData);
  });

  it('should not create chart after view init if data is not available', () => {
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineDetailChartData[]) => void }, 'createChart');

    component.ngAfterViewInit();

    expect(createChartSpy).not.toHaveBeenCalled();
  });

  it('should call lineDetailChartService.createChart with correct parameters', () => {
    const mockChartData: LineDetailChartData[] = [{ name: 'Test', khours: 10, programs: 5, selected: false }];
    const createChartSpy = jest.spyOn(mockLineDetailChartService, 'createChart');
    fixture.componentRef.setInput('chartData', mockChartData);

    fixture.detectChanges();

    expect(createChartSpy).toHaveBeenCalled();
  });

  it('should recreate chart after resize event', () => {
    const mockChartData: LineDetailChartData[] = [{ name: 'Test', khours: 10, programs: 5, selected: false }];
    const createChartSpy = jest.spyOn(mockLineDetailChartService, 'createChart');

    fixture.componentRef.setInput('chartData', mockChartData);

    (component as unknown as { onResize: () => void })['onResize']();

    expect(createChartSpy).toHaveBeenCalled();
  });
});
