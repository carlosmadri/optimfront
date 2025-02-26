/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { MapGraphService } from './map-graph.service';
import { MapData } from '@src/app/shared/models/graphs/map-charts.model';

const mockD3Selection = {
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  call: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  transition: jest.fn().mockReturnThis(),
  duration: jest.fn().mockReturnThis(),
  selectAll: jest.fn().mockReturnThis(),
  data: jest.fn().mockReturnThis(),
  enter: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
};

const mockZoom = {
  scaleExtent: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  transform: jest.fn(),
};

jest.mock('d3', () => ({
  select: jest.fn(() => mockD3Selection),
  geoMercator: jest.fn(() => ({
    scale: jest.fn().mockReturnThis(),
    translate: jest.fn().mockReturnThis(),
  })),
  geoPath: jest.fn(() => ({
    projection: jest.fn().mockReturnThis(),
  })),
  zoom: jest.fn(() => mockZoom),
  json: jest.fn().mockResolvedValue({}),
  zoomIdentity: {
    translate: jest.fn().mockReturnThis(),
    scale: jest.fn().mockReturnThis(),
  },
}));

describe('MapGraphService', () => {
  let service: MapGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapGraphService],
    });
    service = TestBed.inject(MapGraphService);

    // Mock necessary properties
    service['svg'] = mockD3Selection as any;
    service['g'] = mockD3Selection as any;
    service['projection'] = jest.fn().mockReturnValue([0, 0]) as any;
    service['path'] = {
      bounds: jest.fn().mockReturnValue([
        [0, 0],
        [100, 100],
      ]),
      centroid: jest.fn().mockReturnValue([50, 50]),
    } as any;
    service['zoom'] = mockZoom as any;
    service['width'] = 800;
    service['height'] = 600;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call initializeMap without errors', () => {
    const mockElement = document.createElement('div');
    expect(() => service.initializeMap(mockElement, 800, 600)).not.toThrow();
  });

  it('should call loadWorldMap without errors', async () => {
    await expect(service.loadWorldMap()).resolves.not.toThrow();
  });

  it('should call drawMap without errors', () => {
    const mockMapData: MapData[] = [
      {
        name: 'USA',
        regions: [{ name: 'New York', coords: [0, 0], value: 100 }],
        coords: [0, 0],
        total: 100,
      },
    ];
    service['world'] = {
      objects: {
        countries: {
          type: 'GeometryCollection',
          geometries: [],
        },
      },
    } as any;
    expect(() => service.drawMap(mockMapData)).not.toThrow();
  });

  it('should call resetZoom without errors', () => {
    service['zoomState'] = 'country';
    expect(() => service.resetZoom()).not.toThrow();
  });

  it('should call redrawMap without errors', () => {
    const mockElement = document.createElement('div');
    const mockMapData: MapData[] = [
      {
        name: 'USA',
        regions: [{ name: 'New York', coords: [0, 0], value: 100 }],
        coords: [0, 0],
        total: 100,
      },
    ];
    expect(() => service.redrawMap(mockElement, 800, 600, mockMapData)).not.toThrow();
  });
});
