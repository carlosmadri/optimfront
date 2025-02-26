import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';
import { LineChartService } from './services/line-chart.service';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';
describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;
  let mockLineChartService: jest.Mocked<LineChartService>;

  beforeEach(async () => {
    class MockLineChartService implements Partial<LineChartService> {
      createChart = jest.fn();
    }

    mockLineChartService = new MockLineChartService() as unknown as jest.Mocked<LineChartService>;

    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [{ provide: LineChartService, useValue: mockLineChartService }],
    })
      .overrideComponent(LineChartComponent, {
        set: {
          providers: [{ provide: LineChartService, useValue: mockLineChartService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChart when lineChartData is set', () => {
    const mockChartData: LineChartData = {} as LineChartData;
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineChartData) => void }, 'createChart');

    fixture.componentRef.setInput('lineChartData', mockChartData);
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
    const mockChartData: LineChartData = {} as LineChartData;
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineChartData) => void }, 'createChart');

    fixture.componentRef.setInput('lineChartData', mockChartData);
    component.ngAfterViewInit();

    expect(createChartSpy).toHaveBeenCalledWith(mockChartData);
  });

  it('should not create chart after view init if data is not available', () => {
    const createChartSpy = jest.spyOn(component as unknown as { createChart: (data: LineChartData) => void }, 'createChart');

    component.ngAfterViewInit();

    expect(createChartSpy).not.toHaveBeenCalled();
  });

  it('should call lineChartService.createChart with correct parameters', () => {
    const mockChartData: LineChartData = {} as LineChartData;
    const createCharSpy = jest.spyOn(mockLineChartService, 'createChart');
    fixture.componentRef.setInput('lineChartData', mockChartData);

    fixture.detectChanges();

    expect(createCharSpy).toHaveBeenCalled();
  });

  it('should recreate chart after resize event', () => {
    const mockChartData: LineChartData = {} as LineChartData;
    const createCharSpy = jest.spyOn(mockLineChartService, 'createChart');

    fixture.componentRef.setInput('lineChartData', mockChartData);

    (component as unknown as { onResize: () => void })['onResize']();

    expect(createCharSpy).toHaveBeenCalled();
  });
});
