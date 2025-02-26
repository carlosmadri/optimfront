import { TestBed } from '@angular/core/testing';

import { CostCenterService } from './cost-center.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CostCenterService', () => {
  let service: CostCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(CostCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
