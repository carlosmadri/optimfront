import { TestBed } from '@angular/core/testing';

import { LineDetailChartService } from './line-detail-chart.service';

describe('LineDetailChartService', () => {
  let service: LineDetailChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineDetailChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
