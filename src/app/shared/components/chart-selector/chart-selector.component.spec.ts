import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSelectorComponent } from './chart-selector.component';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { signal } from '@angular/core';
import { ChartIds } from '../../models/worksync.model';

describe('ChartSelectorComponent', () => {
  let component: ChartSelectorComponent;
  let fixture: ComponentFixture<ChartSelectorComponent>;
  let mockChartSelectorService: Partial<ChartSelectorService>;

  const mockWorkloadChecks = signal<ChartIds[]>([]);
  const mockSelectedChecks = signal<ChartIds[]>([]);

  beforeEach(async () => {
    mockChartSelectorService = {
      selectedChecks: mockSelectedChecks,
      workloadChecks: mockWorkloadChecks,
      setSelectedChecks: jest.fn(),
      setWorkloadChecks: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ChartSelectorComponent],
      providers: [{ provide: ChartSelectorService, useValue: mockChartSelectorService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial values for formGraphChecks', () => {
    expect(component.formGraphChecks.get(ChartIds.WIP)?.value).toBe(true);
    expect(component.formGraphChecks.get(ChartIds.FCII)?.value).toBe(true);
    expect(component.formGraphChecks.get(ChartIds.OP)?.value).toBe(true);
    expect(component.formGraphChecks.get(ChartIds.REALISTIC)?.value).toBe(true);
    expect(component.formGraphChecks.get(ChartIds.VALIDATION)?.value).toBe(true);
    expect(component.formGraphChecks.get(ChartIds.OPTIMISTIC)?.value).toBe(true);
  });

  it('should update form values', () => {
    component.formGraphChecks.patchValue({ fcII: true });
    expect(component.formGraphChecks.get(ChartIds.FCII)?.value).toBe(true);
  });

  describe('workloadChecks', () => {
    it('should return correct workload checks', () => {
      fixture.componentRef.setInput('selectorType', 'worksync');
      mockWorkloadChecks.set([ChartIds.OP, ChartIds.FCII, ChartIds.WIP, ChartIds.FIRST_SUBMISSION, ChartIds.QMC, ChartIds.HOT1Q]);

      fixture.detectChanges();

      const result = component.workloadChecksIndex();
      expect(result).toEqual(new Set([3, 4, 5, 6, 7, 8]));
    });
  });
});
