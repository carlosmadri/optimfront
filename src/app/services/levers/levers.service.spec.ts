import { TestBed } from '@angular/core/testing';

import { LeversService } from './levers.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LeversTotal, LeversTotalAPI } from '@app/shared/models/levers-total.model';
import { GET_TOTAL_LEVERS_EOY } from '@app/shared/api.urls';

describe('LeversService', () => {
  let service: LeversService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(LeversService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getTotalByEoY', () => {
    it('should fetch data and update signal', async () => {
      const mockApiData: LeversTotalAPI[] = [
        { leverType: 'Type1', leaver: 100, recovery: 4 },
        { leverType: 'Type2', leaver: 50, recovery: 2 },
      ];
      const mockResponseData: LeversTotal[] = [
        { leverType: 'Type1', totalAmount: 100 },
        { leverType: 'Type1', totalAmount: 4 },
        { leverType: 'Type2', totalAmount: 50 },
        { leverType: 'Type2', totalAmount: 2 },
      ];

      const promise = service.getTotalByEoY();

      const req = httpTestingController.expectOne(`${GET_TOTAL_LEVERS_EOY}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiData);

      await promise;

      expect(service.totalByEoY()).toEqual(mockResponseData);
    });

    it('should include params in the URL when provided', async () => {
      const params = ['param1', 'param2'];
      const promise = service.getTotalByEoY(params);

      const req = httpTestingController.expectOne(`${GET_TOTAL_LEVERS_EOY}?param1&param2`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      await promise;
    });

    it('should handle HTTP errors', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      const promise = service.getTotalByEoY();

      const req = httpTestingController.expectOne(`${GET_TOTAL_LEVERS_EOY}`);
      expect(req.request.method).toBe('GET');
      req.flush('', errorResponse);

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.totalByEoY()).toEqual([]);
    });
  });
});
