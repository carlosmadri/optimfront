import { TestBed } from '@angular/core/testing';

import { DonutChartService } from './donut-chart.service';

describe('DonutChartService', () => {
  let service: DonutChartService;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DonutChartService],
    });
    element = document.createElement('div');
    service = TestBed.inject(DonutChartService);
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize chart correctly', () => {
    service.createChart(element);
    expect(service.hasChart()).toBeTruthy();
  });

  it('should update chart correctly', () => {
    service.createChart(element);
    const data = [10, 20, 30];
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    service.updateChart(data, colors);
    expect(service.hasChart()).toBeTruthy();
  });

  it('should set title and subtitle colors correctly', () => {
    const titleColor = '#123456';
    const subtitleColor = '#654321';
    service.createChart(element, titleColor, subtitleColor);
    expect(service['titleColor']).toBe(titleColor);
    expect(service['subtitleColor']).toBe(subtitleColor);
  });

  it('should destroy chart correctly', () => {
    service.createChart(element);
    service.destroyChart();
    expect(service.hasChart()).toBeFalsy();
  });
});
