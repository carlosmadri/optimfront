import { TestBed } from '@angular/core/testing';

import { WorksyncService } from './worksync.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DirectIndirect } from '@src/app/shared/models/employee.model';
import { GET_WORKLOAD_DIRECT_RATIO, GET_WORKLOAD_EVOLUTION, GET_WORKLOAD_OWN_SUB_RATIO, GET_WORKLOAD_PER_PROGRAM } from '@src/app/shared/api.urls';
import { WorkloadEvolutionAPI, WorkloadEvolutionStatusAPI, WorkloadPerProgramAPI } from '@src/app/shared/models/worksync.model';

describe('WorksyncService', () => {
  let service: WorksyncService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorksyncService);
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

      const req = httpMock.expectOne(GET_WORKLOAD_DIRECT_RATIO);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.directRatio()).toEqual(mockData);
    });

    it('should fetch direct ratio data with params', async () => {
      const mockData: DirectIndirect = { direct: 70, indirect: 30 };
      const params = ['year=2023', 'siglum=6'];

      const promise = service.getDirectRatio(params);

      const req = httpMock.expectOne(`${GET_WORKLOAD_DIRECT_RATIO}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.directRatio()).toEqual(mockData);
    });

    it('should handle errors and set directRatio to null', async () => {
      const errorMessage = 'Test error';

      const promise = service.getDirectRatio();

      const req = httpMock.expectOne(GET_WORKLOAD_DIRECT_RATIO);
      req.error(new ErrorEvent('Network error', { message: errorMessage }));

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.directRatio()).toBeNull();
    });

    it('should update directRatio signal with new data', async () => {
      const initialData: DirectIndirect = { direct: 60, indirect: 40 };
      const updatedData: DirectIndirect = { direct: 70, indirect: 30 };

      // First call
      let promise = service.getDirectRatio();
      let req = httpMock.expectOne(GET_WORKLOAD_DIRECT_RATIO);
      req.flush(initialData);
      await promise;
      expect(service.directRatio()).toEqual(initialData);

      // Second call with updated data
      promise = service.getDirectRatio();
      req = httpMock.expectOne(GET_WORKLOAD_DIRECT_RATIO);
      req.flush(updatedData);
      await promise;
      expect(service.directRatio()).toEqual(updatedData);
    });

    it('should handle empty response', async () => {
      const promise = service.getDirectRatio();

      const req = httpMock.expectOne(GET_WORKLOAD_DIRECT_RATIO);
      req.flush(null);

      await promise;

      expect(service.directRatio()).toBeNull();
    });
  });

  describe('getOwnSubRatio', () => {
    it('should fetch own sub data without params', async () => {
      const mockData: DirectIndirect = { direct: 60, indirect: 40 };

      const promise = service.getOwnSubRatio();

      const req = httpMock.expectOne(GET_WORKLOAD_OWN_SUB_RATIO);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.ownSub()).toEqual(mockData);
    });

    it('should fetch own sub data with params', async () => {
      const mockData: DirectIndirect = { direct: 70, indirect: 30 };
      const params = ['year=2023', 'siglum=6'];

      const promise = service.getOwnSubRatio(params);

      const req = httpMock.expectOne(`${GET_WORKLOAD_OWN_SUB_RATIO}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.ownSub()).toEqual(mockData);
    });
  });

  describe('getWorkLoadPerProgram', () => {
    const mockData: WorkloadPerProgramAPI[] = [
      {
        programName: 'Program 1',
        programKHrsSum: 10,
        programsCount: 6,
      },
      {
        programName: 'Program 2',
        programKHrsSum: 2,
        programsCount: 1,
      },
    ];
    it('should fetch workload per program data without params', async () => {
      const promise = service.getWorkLoadPerProgram();

      const req = httpMock.expectOne(GET_WORKLOAD_PER_PROGRAM);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.perProgram().length).toEqual(mockData.length);
    });

    it('should fetch  workload per program data with params', async () => {
      const params = ['year=2023', 'siglum=6'];

      const promise = service.getWorkLoadPerProgram(params);

      const req = httpMock.expectOne(`${GET_WORKLOAD_PER_PROGRAM}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.perProgram().length).toEqual(mockData.length);
    });
  });

  describe('getWorkLoadEvolution', () => {
    const mockData: WorkloadEvolutionAPI = {
      workloadEvolutionList: [
        {
          exercise: 'OP24',
          khrsOwnDirect: 1,
          khrsOwnIndirect: 2,
          khrsSubDirect: 3,
          khrsSubIndirect: 4.18,
        },
        {
          exercise: 'QMC',
          khrsOwnDirect: 5,
          khrsOwnIndirect: 6,
          khrsSubDirect: 7,
          khrsSubIndirect: 8,
        },
      ],
      lastStatus: WorkloadEvolutionStatusAPI.APPROVED,
      multipleSiglums: false,
    };

    it('should fetch workload evolution data without params', async () => {
      const promise = service.getWorkLoadEvolution();

      const req = httpMock.expectOne(GET_WORKLOAD_EVOLUTION);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.evolution()!.data.length).toEqual(mockData.workloadEvolutionList.length);
    });

    it('should fetch workload evolution data with params', async () => {
      const params = ['year=2023', 'siglum=6'];

      const promise = service.getWorkLoadEvolution(params);

      const req = httpMock.expectOne(`${GET_WORKLOAD_EVOLUTION}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      await promise;

      expect(service.evolution()!.data.length).toEqual(mockData.workloadEvolutionList.length);
    });
  });
});
