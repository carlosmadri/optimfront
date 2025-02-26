import { TestBed } from '@angular/core/testing';
import { DivergingBarService } from './diverging-bar.service';
import { LeversTotal } from '@app/shared/models/levers-total.model';

describe('DivergingBarService', () => {
  let service: DivergingBarService;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DivergingBarService],
    });
    service = TestBed.inject(DivergingBarService);
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasChart', () => {
    it('should indicate there is no SVG element created', () => {
      service.destroyChart();
      expect(service.hasChart()).toBeFalsy();
    });

    it('should indicate the SVG element exist', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, data);
      expect(service.hasChart()).toBeTruthy();
    });
  });

  describe('createChart', () => {
    it('should create an SVG element', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, data);
      expect(element.querySelector('svg')).toBeTruthy();
      expect(service.hasChart()).toBeTruthy();
    });

    it('should create bars and labels', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, data);
      expect(element.querySelectorAll('rect').length).toBe(2);
      expect(element.querySelectorAll('text.totalAmount').length).toBe(2);
      expect(element.querySelectorAll('text.leverType').length).toBe(2);
    });
  });

  describe('updateChart', () => {
    it('should update existing chart', () => {
      const initialData: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, initialData);

      const updatedData: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 15 },
        { leverType: 'Type2', totalAmount: -10 },
        { leverType: 'Type3', totalAmount: 5 },
      ];
      service.updateChart(updatedData);

      expect(element.querySelectorAll('rect').length).toBe(3);
      expect(element.querySelectorAll('text.totalAmount').length).toBe(3);
      expect(element.querySelectorAll('text.leverType').length).toBe(3);
    });
  });

  describe('resizeChart', () => {
    it('should resize the chart', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];

      // Set initial size
      Object.defineProperty(element, 'clientWidth', { value: 300, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 200, configurable: true });
      service.createChart(element, data);
      const initialViewBox = element.querySelector('svg')?.getAttribute('viewBox');

      // Change size and resize
      Object.defineProperty(element, 'clientWidth', { value: 500, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });
      service.resizeChart(element, data);
      const resizedViewBox = element.querySelector('svg')?.getAttribute('viewBox');

      expect(resizedViewBox).not.toBe(initialViewBox);
      expect(resizedViewBox?.split(' ')[2]).toBe('500');
      expect(parseInt(resizedViewBox?.split(' ')[3] || '0')).toBeGreaterThan(200);
    });
  });

  describe('destroyChart', () => {
    it('should remove the SVG element', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, data);
      expect(element.querySelector('svg')).toBeTruthy();
      expect(service.hasChart()).toBeTruthy();

      service.destroyChart();
      expect(element.querySelector('svg')).toBeFalsy();
      expect(service.hasChart()).toBeFalsy();
    });

    it('should handle multiple calls to destroyChart', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service.createChart(element, data);
      expect(element.querySelector('svg')).toBeTruthy();

      service.destroyChart();
      expect(element.querySelector('svg')).toBeFalsy();

      expect(() => service.destroyChart()).not.toThrow();
    });
  });

  describe('private methods', () => {
    it('should create scales correctly', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service['createSvg'](element, data);
      service['createScales'](data);

      expect(service['x']).toBeDefined();
      expect(service['y']).toBeDefined();
    });

    it('should draw bars correctly', () => {
      const data: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 10 },
        { leverType: 'Type2', totalAmount: -5 },
      ];
      service['createSvg'](element, data);
      service['createScales'](data);
      service['drawBars'](data);

      const bars = element.querySelectorAll('rect');
      expect(bars.length).toBe(2);
    });
  });
});
