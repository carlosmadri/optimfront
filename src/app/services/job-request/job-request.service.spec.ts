import { TestBed } from '@angular/core/testing';

import { JobRequestService } from './job-request.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CRUD_JR, GET_JR_COUNT_BY_TYPE } from '@src/app/shared/api.urls';
import { JobRequest, JobRequestSummaryTypes } from '@src/app/shared/models/job-request.model';

describe('JobRequestService', () => {
  let service: JobRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(JobRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTypesSummary', () => {
    it('should fetch summary JR types data without params', async () => {
      const mockData: JobRequestSummaryTypes[] = [
        { type: 'Vacation', count: 5 },
        { type: 'Sick Leave', count: 3 },
      ];

      const promise = service.getTypesSummary();

      const req = httpMock.expectOne(GET_JR_COUNT_BY_TYPE);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.summaryType()).toEqual(mockData);
    });

    it('should fetch summary JR types data with params', async () => {
      const mockData: JobRequestSummaryTypes[] = [
        { type: 'Vacation', count: 7 },
        { type: 'Sick Leave', count: 2 },
      ];
      const params = ['year=2023', 'month=7'];

      const promise = service.getTypesSummary(params);

      const req = httpMock.expectOne(`${GET_JR_COUNT_BY_TYPE}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.summaryType()).toEqual(mockData);
    });

    it('should handle errors and set summaryType to an empty array', async () => {
      const errorMessage = 'Test error';

      const promise = service.getTypesSummary();

      const req = httpMock.expectOne(GET_JR_COUNT_BY_TYPE);
      req.error(new ErrorEvent('Network error', { message: errorMessage }));

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.summaryType()).toEqual([]);
    });
  });

  describe('summaryType', () => {
    it('should have a readonly summary types signal', () => {
      expect(service.summaryType).toBeDefined();
      expect(typeof service.summaryType).toBe('function');
      expect(service.summaryType()).toEqual([]);
    });
  });

  describe('getJobRequests', () => {
    it('should fetch job requests data without params', async () => {
      const mockData: JobRequest[] = [];

      const promise = service.getJobRequests();

      const req = httpMock.expectOne(CRUD_JR);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.summaryType()).toEqual(mockData);
    });
  });

  describe('getJobRequest', () => {
    it('should fetch job request by id', async () => {
      const mockData: JobRequest = {} as JobRequest;
      const mockIdJR = 10;

      const promise = service.getJobRequest(mockIdJR);

      const req = httpMock.expectOne(`${CRUD_JR}${mockIdJR}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      const result = await promise;

      expect(result).toEqual(mockData);
    });
  });
});
