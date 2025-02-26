import { MapGraphAdapter } from './map-graph.adapter';
import { FTEsLocationAPI } from '../../models/location.model';
import { MapData, Region } from '../../models/graphs/map-charts.model';
import { TestBed } from '@angular/core/testing';

describe('MapGraphAdapter', () => {
  let adapter: MapGraphAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapGraphAdapter],
    });
    adapter = TestBed.inject(MapGraphAdapter);
  });

  it('should group data by country and calculate total FTEs', () => {
    const apiData: FTEsLocationAPI[] = [
      { id: 1, country: 'CountryA', site: 'Site1', longitude: 10, latitude: 20, fteSum: 5 },
      { id: 2, country: 'CountryA', site: 'Site2', longitude: 15, latitude: 25, fteSum: 10 },
      { id: 3, country: 'CountryB', site: 'Site3', longitude: 30, latitude: 40, fteSum: 20 },
    ];

    const result: MapData[] = adapter.adapt(apiData);

    expect(result).toEqual([
      {
        name: 'CountryA',
        regions: [
          { name: 'Site1', coords: [10, 20], value: 5 },
          { name: 'Site2', coords: [15, 25], value: 10 },
        ],
        coords: [12.5, 22.5],
        total: 15,
      },
      {
        name: 'CountryB',
        regions: [{ name: 'Site3', coords: [30, 40], value: 20 }],
        coords: [30, 40],
        total: 20,
      },
    ]);
  });

  it('should handle empty input', () => {
    const apiData: FTEsLocationAPI[] = [];

    const result: MapData[] = adapter.adapt(apiData);

    expect(result).toEqual([]);
  });

  it('should calculate central coordinates correctly', () => {
    const regions: Region[] = [
      { name: 'Site1', coords: [10, 20], value: 5 },
      { name: 'Site2', coords: [20, 30], value: 10 },
    ];

    const centerCoords = adapter.calculateCenterCoords(regions);

    expect(centerCoords).toEqual([15, 25]);
  });

  it('should handle single location correctly', () => {
    const apiData: FTEsLocationAPI[] = [{ id: 1, country: 'CountryA', site: 'Site1', longitude: 10, latitude: 20, fteSum: 5 }];

    const result: MapData[] = adapter.adapt(apiData);

    expect(result).toEqual([
      {
        name: 'CountryA',
        regions: [{ name: 'Site1', coords: [10, 20], value: 5 }],
        coords: [10, 20],
        total: 5,
      },
    ]);
  });
});
