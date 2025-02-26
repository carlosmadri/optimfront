import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapGraphComponent } from './map-graph.component';
import { MapGraphService } from './services/map-graph.service';
import { MapData } from '../../models/graphs/map-charts.model';
import { ElementRef } from '@angular/core';

class MockMapGraphService implements Partial<MapGraphService> {
  initializeMap = jest.fn();
  loadWorldMap = jest.fn().mockResolvedValue(undefined);
  drawMap = jest.fn();
  resetZoom = jest.fn();
  redrawMap = jest.fn();
}

describe('MapGraphComponent', () => {
  let component: MapGraphComponent;
  let fixture: ComponentFixture<MapGraphComponent>;
  let mockMapService: MockMapGraphService;
  let elementRefMock: Partial<ElementRef>;

  beforeEach(async () => {
    mockMapService = new MockMapGraphService();

    elementRefMock = {
      nativeElement: {
        querySelector: jest.fn().mockReturnValue(document.createElement('div')),
      },
    };

    await TestBed.configureTestingModule({
      imports: [MapGraphComponent],
      providers: [{ provide: ElementRef, useValue: elementRefMock }],
    })
      .overrideComponent(MapGraphComponent, {
        set: {
          providers: [{ provide: MapGraphService, useValue: mockMapService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MapGraphComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize map on init', async () => {
    await component.initializeMap();

    expect(mockMapService.initializeMap).toHaveBeenCalled();
    expect(mockMapService.loadWorldMap).toHaveBeenCalled();
    expect(mockMapService.drawMap).toHaveBeenCalled();
  });

  it('should reset zoom when resetZoom is called', () => {
    component.resetZoom();
    expect(mockMapService.resetZoom).toHaveBeenCalled();
  });

  it('should redraw map when fteLocations input changes', () => {
    const mockFteLocations: MapData[] = [
      {
        name: 'Test Location',
        regions: [
          {
            name: 'Region 1',
            coords: [10, 20],
            value: 5,
          },
        ],
        coords: [0, 0],
        total: 10,
      },
    ];
    fixture.componentRef.setInput('fteLocations', mockFteLocations);
    fixture.detectChanges();
    expect(mockMapService.redrawMap).toHaveBeenCalled();
  });

  it('should remove event listener on ngOnDestroy', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    component.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
