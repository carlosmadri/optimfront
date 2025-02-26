import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { GET_ALL_LOCATIONS, GET_FTE_LOCATIONS } from '@app/shared/api.urls';
import { LOCATION_TYPES, FTEsLocationAPI } from '@models/location.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MapGraphAdapter } from '@src/app/shared/adapters/map-graph/map-graph.adapter';
import { MapData } from '@src/app/shared/models/graphs/map-charts.model';

describe('LocationService', () => {
  let service: LocationService;
  let httpTestingController: HttpTestingController;
  let mapGraphAdapterMock: jest.Mocked<MapGraphAdapter>;

  beforeEach(() => {
    mapGraphAdapterMock = {
      adapt: jest.fn() as jest.MockedFunction<(apiData: FTEsLocationAPI[]) => MapData[]>,
    } as unknown as jest.Mocked<MapGraphAdapter>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        LocationService,
        { provide: MapGraphAdapter, useValue: mapGraphAdapterMock },
      ],
    });
    service = TestBed.inject(LocationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllLocations', () => {
    // it('should fetch and format all locations', async () => {
    //   const mockResponse: Partial<LocationAPiResponse> = {
    //     content: [
    //       { id: 1, country: 'USA', site: 'New York' },
    //       { id: 2, country: 'USA', site: 'Los Angeles' },
    //       { id: 3, country: 'Canada', site: 'Toronto' },
    //     ],
    //   };
    //
    //   const getAllLocationsPromise = service.getAllLocations();
    //
    //   const req = httpTestingController.expectOne(GET_ALL_LOCATIONS);
    //   expect(req.request.method).toBe('GET');
    //   req.flush(mockResponse);
    //
    //   await getAllLocationsPromise;
    //
    //   expect(service.allCountries()).toEqual(['USA', 'Canada']);
    //   expect(service.allSites()).toEqual(['New York', 'Los Angeles', 'Toronto']);
    // });

    it('should handle errors when fetching all locations', async () => {
      const getAllLocationsPromise = service.getAllLocations();

      const req = httpTestingController.expectOne(GET_ALL_LOCATIONS);
      req.error(new ErrorEvent('Network error'));

      await expect(getAllLocationsPromise).rejects.toThrow('Something bad happened; please try again later.');
    });
  });

  describe('getFTEsLocations', () => {
    const mockApiResponse: FTEsLocationAPI[] = [
      { id: 1, country: 'USA', site: 'New York', fteSum: 100, longitude: -74.006, latitude: 40.7128 },
      { id: 2, country: 'USA', site: 'Los Angeles', fteSum: 80, longitude: -118.2437, latitude: 34.0522 },
      { id: 3, country: 'Canada', site: 'Toronto', fteSum: 50, longitude: -79.3832, latitude: 43.6532 },
    ];

    const mockAdapterResponse: MapData[] = [
      {
        name: 'USA',
        regions: [
          { name: 'New York', coords: [-74.006, 40.7128], value: 100 },
          { name: 'Los Angeles', coords: [-118.2437, 34.0522], value: 80 },
        ],
        coords: [-96.12485, 37.3825],
        total: 180,
      },
      {
        name: 'Canada',
        regions: [{ name: 'Toronto', coords: [-79.3832, 43.6532], value: 50 }],
        coords: [-79.3832, 43.6532],
        total: 50,
      },
    ];

    it('should fetch FTEs locations without params and adapt to map format', async () => {
      mapGraphAdapterMock.adapt.mockReturnValue(mockAdapterResponse);
      const getFTEsLocationsPromise = service.getFTEsLocations();

      const req = httpTestingController.expectOne(GET_FTE_LOCATIONS);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);

      await getFTEsLocationsPromise;

      const result = service.fteLocations();
      expect(result.length).toBe(2);

      // Check USA data
      expect(result[0]).toEqual(expect.objectContaining(mockAdapterResponse[0]));
      expect(result[0].coords[0]).toBeCloseTo(-96.12485, 5);
      expect(result[0].coords[1]).toBeCloseTo(37.3825, 5);

      // Check Canada data
      expect(result[1]).toEqual(
        expect.objectContaining({
          name: 'Canada',
          regions: [{ name: 'Toronto', coords: [-79.3832, 43.6532], value: 50 }],
          total: 50,
        }),
      );
      expect(result[1].coords[0]).toBeCloseTo(-79.3832, 5);
      expect(result[1].coords[1]).toBeCloseTo(43.6532, 5);
    });

    it('should handle errors when fetching FTEs locations', async () => {
      const getFTEsLocationsPromise = service.getFTEsLocations();

      const req = httpTestingController.expectOne(GET_FTE_LOCATIONS);
      req.error(new ErrorEvent('Network error'));

      await expect(getFTEsLocationsPromise).rejects.toThrow('Something bad happened; please try again later.');
      expect(service.fteLocations()).toEqual([]);
    });
  });

  describe('getLocationsFilterFields', () => {
    it('should return location types', () => {
      expect(service.getLocationsFilterFields()).toEqual(Object.values(LOCATION_TYPES));
    });
  });

  describe('getCountriesFilterValues', () => {
    it('should return an object with a country property', () => {
      const result = service.getCountriesFilterValues();
      expect(result).toHaveProperty('country');
    });
  });

  describe('getSitesFilterValues', () => {
    it('should return an object with a site property when no countries are specified', () => {
      const result = service.getSitesFilterValues();
      expect(result).toHaveProperty('site');
    });

    it('should return an object with a site property when countries are specified', () => {
      const result = service.getSitesFilterValues(['USA']);
      expect(result).toHaveProperty('site');
    });
  });
});
