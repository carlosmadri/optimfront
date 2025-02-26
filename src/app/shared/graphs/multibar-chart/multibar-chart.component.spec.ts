import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultibarChartComponent } from './multibar-chart.component';
import { ChartIds, WorkloadEvolutionBarData, WorkloadEvolutionBarType } from '../../models/worksync.model';
import { MultibarChartService } from './services/multibar-chart.service';
import { ExerciseColorService } from './services/exercise-color.service';

describe('MultibarChartComponent', () => {
  let component: MultibarChartComponent;
  let fixture: ComponentFixture<MultibarChartComponent>;
  let mockMultibarChartService: jest.Mocked<MultibarChartService>;
  let mockExerciseColorService: jest.Mocked<ExerciseColorService>;

  beforeEach(async () => {
    mockMultibarChartService = {
      createChart: jest.fn(),
      updateChart: jest.fn(),
      destroyChart: jest.fn(),
      hasChart: jest.fn(),
      resizeChart: jest.fn(),
      setColorMap: jest.fn(),
    } as unknown as jest.Mocked<MultibarChartService>;

    mockExerciseColorService = {
      getColorMap: jest.fn(),
    } as unknown as jest.Mocked<ExerciseColorService>;

    await TestBed.configureTestingModule({
      imports: [MultibarChartComponent],
      providers: [
        { provide: MultibarChartService, useValue: mockMultibarChartService },
        { provide: ExerciseColorService, useValue: mockExerciseColorService },
      ],
    })
      .overrideComponent(MultibarChartComponent, {
        set: {
          providers: [
            { provide: MultibarChartService, useValue: mockMultibarChartService },
            { provide: ExerciseColorService, useValue: mockExerciseColorService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MultibarChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should update chart when chartData is set and not empty', () => {
    const mockChartData: WorkloadEvolutionBarData[] = [
      { exercise: 'OP22', id: ChartIds.OP, barType: WorkloadEvolutionBarType.OP, ownDirect: 10, ownIndirect: 5, subDirect: 3, subIndirect: 2, total: 20 },
    ];
    mockMultibarChartService.hasChart.mockReturnValue(true);
    const updateChartSpy = jest.spyOn(mockMultibarChartService, 'updateChart');

    fixture.componentRef.setInput('chartData', mockChartData);

    fixture.detectChanges();

    expect(updateChartSpy).toHaveBeenCalled();
  });

  it('should destroy chart when chartData is empty', () => {
    fixture.componentRef.setInput('chartData', null);

    fixture.detectChanges();

    expect(mockMultibarChartService.destroyChart).toHaveBeenCalled();
  });

  it('should call colorService.getColorMap and chartService.setColorMap when updating chart', () => {
    const mockChartData: WorkloadEvolutionBarData[] = [
      { exercise: 'OP23', id: ChartIds.OP, barType: WorkloadEvolutionBarType.OP, ownDirect: 10, ownIndirect: 5, subDirect: 3, subIndirect: 2, total: 20 },
    ];
    const mockColorMap = new Map([['OP', '#000000']]);
    mockExerciseColorService.getColorMap.mockReturnValue(mockColorMap);

    fixture.componentRef.setInput('chartData', mockChartData);

    fixture.detectChanges();

    expect(mockExerciseColorService.getColorMap).toHaveBeenCalledWith(['OP'], ['OP23']);
    expect(mockMultibarChartService.setColorMap).toHaveBeenCalledWith(mockColorMap);
  });

  it('should call chartService.createChart when chart does not exist', () => {
    const mockChartData: WorkloadEvolutionBarData[] = [
      { exercise: 'OP26', id: ChartIds.OP, barType: WorkloadEvolutionBarType.OP, ownDirect: 10, ownIndirect: 5, subDirect: 3, subIndirect: 2, total: 20 },
    ];
    mockMultibarChartService.hasChart.mockReturnValue(false);

    fixture.componentRef.setInput('chartData', mockChartData);

    fixture.detectChanges();

    expect(mockMultibarChartService.createChart).toHaveBeenCalled();
  });

  it('should call chartService.updateChart when chart exists', () => {
    const mockChartData: WorkloadEvolutionBarData[] = [
      { exercise: 'OP25', id: ChartIds.OP, barType: WorkloadEvolutionBarType.OP, ownDirect: 10, ownIndirect: 5, subDirect: 3, subIndirect: 2, total: 20 },
    ];
    mockMultibarChartService.hasChart.mockReturnValue(true);

    fixture.componentRef.setInput('chartData', mockChartData);

    fixture.detectChanges();

    expect(mockMultibarChartService.updateChart).toHaveBeenCalled();
  });
});
