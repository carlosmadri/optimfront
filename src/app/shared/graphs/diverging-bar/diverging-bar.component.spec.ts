import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivergingBarComponent } from './diverging-bar.component';
import { DivergingBarService } from './services/diverging-bar.service';
import { ElementRef } from '@angular/core';
import { LeversTotal } from '@app/shared/models/levers-total.model';

describe('DivergingBarComponent', () => {
  let component: DivergingBarComponent;
  let fixture: ComponentFixture<DivergingBarComponent>;
  let mockDivergingBarService: jest.Mocked<DivergingBarService>;

  beforeEach(async () => {
    class MockDivergingBarService implements Partial<DivergingBarService> {
      createChart = jest.fn();
      updateChart = jest.fn();
      resizeChart = jest.fn();
      destroyChart = jest.fn();
      hasChart = jest.fn();
    }

    mockDivergingBarService = new MockDivergingBarService() as unknown as jest.Mocked<DivergingBarService>;

    await TestBed.configureTestingModule({
      imports: [DivergingBarComponent],
    })
      .overrideComponent(DivergingBarComponent, {
        set: {
          providers: [{ provide: DivergingBarService, useValue: mockDivergingBarService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DivergingBarComponent);
    component = fixture.componentInstance;
    component.chart = { nativeElement: document.createElement('div') } as ElementRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create chart when initialized with data', () => {
    const testData: LeversTotal[] = [{ leverType: 'Test', totalAmount: 10 }];

    fixture.componentRef.setInput('chartData', testData);
    fixture.detectChanges();

    expect(mockDivergingBarService.createChart).toHaveBeenCalledWith(component.chart.nativeElement, testData);
  });

  it('should update chart when data changes', () => {
    const initialData: LeversTotal[] = [{ leverType: 'Initial', totalAmount: 5 }];
    const updatedData: LeversTotal[] = [{ leverType: 'Updated', totalAmount: 10 }];

    jest.spyOn(mockDivergingBarService, 'hasChart').mockReturnValueOnce(true);
    fixture.componentRef.setInput('chartData', initialData);
    fixture.detectChanges();

    expect(mockDivergingBarService.updateChart).toHaveBeenCalledWith(initialData);

    jest.spyOn(mockDivergingBarService, 'hasChart').mockReturnValueOnce(true);
    fixture.componentRef.setInput('chartData', updatedData);
    fixture.detectChanges();

    expect(mockDivergingBarService.updateChart).toHaveBeenCalledWith(updatedData);
  });

  it('should destroy chart when data becomes empty', () => {
    const initialData: LeversTotal[] = [{ leverType: 'Initial', totalAmount: 5 }];

    fixture.componentRef.setInput('chartData', initialData);
    fixture.detectChanges();

    fixture.componentRef.setInput('chartData', []);
    fixture.detectChanges();

    expect(mockDivergingBarService.destroyChart).toHaveBeenCalled();
  });

  it('should resize chart when window is resized', () => {
    const testData: LeversTotal[] = [{ leverType: 'Test', totalAmount: 10 }];
    fixture.componentRef.setInput('chartData', testData);
    fixture.detectChanges();

    window.dispatchEvent(new Event('resize'));

    expect(mockDivergingBarService.resizeChart).toHaveBeenCalledWith(component.chart.nativeElement, testData);
  });

  it('should not create chart if data is empty on initialization', () => {
    fixture.componentRef.setInput('chartData', []);
    fixture.detectChanges();

    expect(mockDivergingBarService.createChart).not.toHaveBeenCalled();
  });

  it('should destroy chart when component is destroyed', () => {
    const testData: LeversTotal[] = [{ leverType: 'Test', totalAmount: 10 }];
    fixture.componentRef.setInput('chartData', testData);
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(mockDivergingBarService.destroyChart).toHaveBeenCalled();
  });
});
