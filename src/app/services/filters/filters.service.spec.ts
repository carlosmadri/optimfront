import { TestBed } from '@angular/core/testing';
import { FiltersService } from './filters.service';
import { provideHttpClient } from '@angular/common/http';
import { LocationService } from '@services/location/location.service';
import { SiglumService } from '@services/siglum/siglum.service';
import { signal } from '@angular/core';
import { AllSiglums, Siglum } from '@models/siglum.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FiltersService', () => {
  let service: FiltersService;

  const mockLocationService: Partial<LocationService> = {
    getSitesFilterValues: jest.fn(),
    getCountriesFilterValues: jest.fn(),
    getAllLocations: jest.fn(),
  };

  const allSiglums = signal<Siglum[]>([]);
  const allFormattedSiglums = signal<AllSiglums | null>(null);
  const mockSiglumService: Partial<SiglumService> = {
    allSiglums: allSiglums,
    allFormattedSiglums: allFormattedSiglums,
    getAllSiglums: jest.fn(),
    getSiglumFilterFields: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LocationService, useValue: mockLocationService },
        { provide: SiglumService, useValue: mockSiglumService },
      ],
    });
    service = TestBed.inject(FiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
