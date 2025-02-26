import { TestBed } from '@angular/core/testing';

import { MultibarChartService } from './multibar-chart.service';

describe('MultibarChartService', () => {
  let service: MultibarChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultibarChartService],
    });
    service = TestBed.inject(MultibarChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
