import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkloadPerProgramComponent } from './workload-per-program.component';
import { MockLineDetailChartComponent } from '@src/app/mocks/components/line-detail-chart-mock.component';
import { LineDetailChartComponent } from '@src/app/shared/graphs/line-detail-chart/line-detail-chart.component';
import { LineDetailChartData } from '@src/app/shared/models/graphs/line-detail-chart.model';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { signal } from '@angular/core';

describe('WorkloadPerProgramComponent', () => {
  let component: WorkloadPerProgramComponent;
  let fixture: ComponentFixture<WorkloadPerProgramComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  const mockData: LineDetailChartData[] = [
    {
      name: 'Program 1 long name plus plus plus',
      khours: 12,
      programs: 4,
    },
    {
      name: 'Program 2',
      khours: 30,
      programs: 6,
    },
    {
      name: 'Program 3 medium',
      khours: 10,
      programs: 2,
    },
    {
      name: 'Program 4 medium',
      khours: 20,
      programs: 6,
    },
    {
      name: 'Program 5 medium',
      khours: 0,
      programs: 19,
    },
  ];

  beforeEach(async () => {
    mockWorksyncService = {
      perProgram: signal<LineDetailChartData[]>(JSON.parse(JSON.stringify(mockData))),
      getWorkLoadPerProgram: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    TestBed.overrideComponent(WorkloadPerProgramComponent, {
      remove: {
        imports: [LineDetailChartComponent],
      },
      add: {
        imports: [MockLineDetailChartComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [WorkloadPerProgramComponent, MockLineDetailChartComponent],
      providers: [
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkloadPerProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should discard programs with 0 khours', () => {
    expect(component.chartData().length).toEqual(mockData.length - 1);
  });

  describe('selectedProgram', () => {
    it('should return the selected program', () => {
      expect(component.selectedProgram()).toEqual({
        name: mockData[0].name,
        khours: mockData[0].khours,
        programs: mockData[0].programs,
        selected: true,
      });
    });

    it('should return undefined if no program is selected', () => {
      component['_chartData'].update((data) => data.map((item) => ({ ...item, selected: false })));
      expect(component.selectedProgram()).toBeUndefined();
    });
  });

  describe('hasPrev', () => {
    it('should return false when the selected program is the first', () => {
      expect(component.hasPrev()).toBeFalsy();
    });

    it('should return true when the first program is not selected', () => {
      component.nextProgram();

      expect(component.hasPrev()).toBeTruthy();
    });
  });

  describe('hasNext', () => {
    it('should return true when the selected program is not the last', () => {
      expect(component.hasNext()).toBe(true);
    });

    it('should return false when the last program is selected', () => {
      component['_chartData'].update((data) => data.map((item, index) => ({ ...item, selected: index === data.length - 1 })));
      expect(component.hasNext()).toBe(false);
    });
  });

  describe('nextProgram', () => {
    it('should select the next program', () => {
      component.nextProgram();

      expect(component.selectedProgram()).toEqual({
        name: mockData[1].name,
        khours: mockData[1].khours,
        programs: mockData[1].programs,
        selected: true,
      });
    });

    it('should not change selection if the last program is already selected', () => {
      component['_chartData'].update((data) => data.map((item, index) => ({ ...item, selected: index === data.length - 1 })));
      component.nextProgram();
      expect(component.selectedProgram()).toEqual({
        name: mockData[3].name,
        khours: mockData[3].khours,
        programs: mockData[3].programs,
        selected: true,
      });
    });
  });

  describe('prevProgram', () => {
    it('should select the previous program', () => {
      component['_chartData'].update((data) => data.map((item, index) => ({ ...item, selected: index === 3 })));

      component.prevProgram();

      expect(component.selectedProgram()).toEqual({
        name: mockData[2].name,
        khours: mockData[2].khours,
        programs: mockData[2].programs,
        selected: true,
      });
    });

    it('should not change selection if the first program is already selected', () => {
      component.prevProgram();
      expect(component.selectedProgram()).toEqual({
        name: mockData[0].name,
        khours: mockData[0].khours,
        programs: mockData[0].programs,
        selected: true,
      });
    });
  });
});
