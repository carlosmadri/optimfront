import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GET_BORROWED_LEASED, GET_EMPLOYEE_DIRECT_RATIO, GET_EMPLOYEE_NAWF_REASON, GET_MONTHLY_DISTRIBUTION } from '@app/shared/api.urls';
import { DirectIndirect, EmployeeSummaryNAWF } from '@app/shared/models/employee.model';
import { MonthlyDistributionAPI } from '@src/app/shared/models/monthly-distribution.model';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';
import { BorrowedLeasedAdapter } from '@src/app/shared/adapters/borrowed-leased/borrowed-leased.adapter';
import { MonthlyDistributionAdapter } from '@src/app/shared/adapters/monthly-distribution/monthly-distribution.adapter';
import { BorrowedLeased } from '@src/app/shared/models/borrowed-leased.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let borrowedAdapterMock: jest.Mocked<BorrowedLeasedAdapter>;
  let monthlyAdapterMock: jest.Mocked<MonthlyDistributionAdapter>;

  beforeEach(() => {
    borrowedAdapterMock = {
      adapt: jest.fn() as jest.MockedFunction<(apiData: MonthlyDistributionAPI) => BorrowedLeased>,
    } as unknown as jest.Mocked<BorrowedLeasedAdapter>;

    monthlyAdapterMock = {
      adapt: jest.fn() as jest.MockedFunction<(apiData: MonthlyDistributionAPI) => LineChartData>,
    } as unknown as jest.Mocked<MonthlyDistributionAdapter>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MonthlyDistributionAdapter, useValue: monthlyAdapterMock },
        { provide: BorrowedLeasedAdapter, useValue: borrowedAdapterMock },
      ],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDirectRatio', () => {
    it('should fetch direct ratio data without params', async () => {
      const mockData: DirectIndirect = { direct: 60, indirect: 40 };

      const promise = service.getDirectRatio();

      const req = httpMock.expectOne(GET_EMPLOYEE_DIRECT_RATIO);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.directRatio()).toEqual(mockData);
    });

    it('should fetch direct ratio data with params', async () => {
      const mockData: DirectIndirect = { direct: 70, indirect: 30 };
      const params = ['year=2023', 'siglum=6'];

      const promise = service.getDirectRatio(params);

      const req = httpMock.expectOne(`${GET_EMPLOYEE_DIRECT_RATIO}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.directRatio()).toEqual(mockData);
    });

    it('should handle errors and set directRatio to null', async () => {
      const errorMessage = 'Test error';

      const promise = service.getDirectRatio();

      const req = httpMock.expectOne(GET_EMPLOYEE_DIRECT_RATIO);
      req.error(new ErrorEvent('Network error', { message: errorMessage }));

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.directRatio()).toBeNull();
    });

    it('should update directRatio signal with new data', async () => {
      const initialData: DirectIndirect = { direct: 60, indirect: 40 };
      const updatedData: DirectIndirect = { direct: 70, indirect: 30 };

      // First call
      let promise = service.getDirectRatio();
      let req = httpMock.expectOne(GET_EMPLOYEE_DIRECT_RATIO);
      req.flush(initialData);
      await promise;
      expect(service.directRatio()).toEqual(initialData);

      // Second call with updated data
      promise = service.getDirectRatio();
      req = httpMock.expectOne(GET_EMPLOYEE_DIRECT_RATIO);
      req.flush(updatedData);
      await promise;
      expect(service.directRatio()).toEqual(updatedData);
    });

    it('should handle empty response', async () => {
      const promise = service.getDirectRatio();

      const req = httpMock.expectOne(GET_EMPLOYEE_DIRECT_RATIO);
      req.flush(null);

      await promise;

      expect(service.directRatio()).toBeNull();
    });
  });

  describe('getSummaryNAWF', () => {
    it('should fetch summary NAWF data without params', async () => {
      const mockData: EmployeeSummaryNAWF[] = [
        { availabilityReason: 'Vacation', employeeCount: 5 },
        { availabilityReason: 'Sick Leave', employeeCount: 3 },
      ];

      const promise = service.getSummaryNAWF();

      const req = httpMock.expectOne(GET_EMPLOYEE_NAWF_REASON);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.summaryNAWF()).toEqual(mockData);
    });

    it('should fetch summary NAWF data with params', async () => {
      const mockData: EmployeeSummaryNAWF[] = [
        { availabilityReason: 'Vacation', employeeCount: 7 },
        { availabilityReason: 'Sick Leave', employeeCount: 2 },
      ];
      const params = ['year=2023', 'month=7'];

      const promise = service.getSummaryNAWF(params);

      const req = httpMock.expectOne(`${GET_EMPLOYEE_NAWF_REASON}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.summaryNAWF()).toEqual(mockData);
    });

    it('should handle errors and set summaryNAWF to an empty array', async () => {
      const errorMessage = 'Test error';

      const promise = service.getSummaryNAWF();

      const req = httpMock.expectOne(GET_EMPLOYEE_NAWF_REASON);
      req.error(new ErrorEvent('Network error', { message: errorMessage }));

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.summaryNAWF()).toEqual([]);
    });
  });

  describe('summaryNAWF', () => {
    it('should have a readonly summaryNAWF signal', () => {
      expect(service.summaryNAWF).toBeDefined();
      expect(typeof service.summaryNAWF).toBe('function');
      expect(service.summaryNAWF()).toEqual([]);
    });
  });

  describe('getMonthlyDistribution', () => {
    const mockResponse = { content: 'anything', totalElements: 1 };
    const mockAdapterResponse = { data: 'anything' };
    it('should fetch monthly distribution without params', async () => {
      monthlyAdapterMock.adapt.mockReturnValue(mockAdapterResponse as unknown as LineChartData);

      const promise = service.getMonthlyDistribution();

      const req = httpMock.expectOne(GET_MONTHLY_DISTRIBUTION);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await promise;
      expect(service.monthlyData()).toBeDefined();
      expect(service.monthlyData()).not.toBeNull();
    });

    it('should fetch  monthly distribution with params', async () => {
      monthlyAdapterMock.adapt.mockReturnValue(mockAdapterResponse as unknown as LineChartData);
      const params = ['page=1', 'size=10'];

      const promise = service.getMonthlyDistribution(params);

      const req = httpMock.expectOne(`${GET_MONTHLY_DISTRIBUTION}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await promise;

      expect(service.monthlyData()).toBeDefined();
      expect(service.monthlyData()).not.toBeNull();
    });

    it('should handle error and set empty monthly distribution', async () => {
      monthlyAdapterMock.adapt.mockReturnValue(null);
      const promise = service.getBorrowedLeased();

      const req = httpMock.expectOne(GET_BORROWED_LEASED);
      req.error(new ErrorEvent('Network error'));

      await expect(promise).rejects.toThrow();
      expect(service.monthlyData()).toBeNull();
    });
  });

  describe('getBorrowedLeased', () => {
    const mockResponse = { content: 'anything', totalElements: 1 };
    const mockAdapterResponse = { data: 'anything' };
    it('should fetch borrowed data without params', async () => {
      borrowedAdapterMock.adapt.mockReturnValue(mockAdapterResponse as unknown as BorrowedLeased);

      const promise = service.getBorrowedLeased();

      const req = httpMock.expectOne(GET_BORROWED_LEASED);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await promise;
      expect(service.borrowedData()).toBeDefined();
      expect(service.borrowedData()).not.toBeNull();
    });

    it('should fetch borrowed data with params', async () => {
      borrowedAdapterMock.adapt.mockReturnValue(mockAdapterResponse as unknown as BorrowedLeased);
      const params = ['page=1', 'size=10'];

      const promise = service.getBorrowedLeased(params);

      const req = httpMock.expectOne(`${GET_BORROWED_LEASED}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      await promise;

      expect(service.borrowedData()).toBeDefined();
      expect(service.borrowedData()).not.toBeNull();
    });

    it('should handle error and set empty borrowed data', async () => {
      borrowedAdapterMock.adapt.mockReturnValue(null);
      const promise = service.getBorrowedLeased();

      const req = httpMock.expectOne(GET_BORROWED_LEASED);
      req.error(new ErrorEvent('Network error'));

      await expect(promise).rejects.toThrow();
      expect(service.borrowedData()).toBeNull();
    });
  });
});
