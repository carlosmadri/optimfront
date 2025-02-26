import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksyncOwnSubComponent } from './worksync-own-sub.component';
import { FiltersService } from '@app/services/filters/filters.service';
import { signal, WritableSignal } from '@angular/core';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { WorksyncOwnSub } from '@src/app/shared/models/worksync.model';

describe('WorksyncOwnSubComponent', () => {
  let component: WorksyncOwnSubComponent;
  let fixture: ComponentFixture<WorksyncOwnSubComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  const initialOwnSub: WorksyncOwnSub = { own: 100, sub: 50 };

  beforeEach(async () => {
    mockWorksyncService = {
      ownSub: signal<WorksyncOwnSub>(initialOwnSub),
      getOwnSubRatio: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };
    await TestBed.configureTestingModule({
      imports: [WorksyncOwnSubComponent],
      providers: [
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksyncOwnSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);
    (mockWorksyncService.ownSub as WritableSignal<WorksyncOwnSub>).set(initialOwnSub);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOwnSubRatio when paramsFilter changes', () => {
    const newParams = ['param1=value1', 'param2=value2'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(newParams);

    fixture.detectChanges();

    expect(mockWorksyncService.getOwnSubRatio).toHaveBeenCalledWith(newParams);
  });

  it('should call loadData on initialization', () => {
    expect(mockWorksyncService.getOwnSubRatio).toHaveBeenCalledWith([]);
    expect(component.ownData()).toBe(100);
    expect(component.subData()).toBe(50);
    expect(component.total()).toBe(66.7);
  });

  it('should call loadData on paramsFilter changes', () => {
    const newParams = ['param1=value1', 'param2=value2'];
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set(newParams);

    fixture.detectChanges();

    expect(mockWorksyncService.getOwnSubRatio).toHaveBeenCalledWith(['param1=value1', 'param2=value2']);
  });

  it('should calculate total ratio correctly', async () => {
    await component.loadData([]);

    expect(component.ownData()).toBe(100);
    expect(component.subData()).toBe(50);
    expect(component.total()).toBe(66.7);
  });

  it('should calculate the ratio when the Own data is a 100%', async () => {
    (mockWorksyncService.ownSub as WritableSignal<WorksyncOwnSub>).set({ own: 5, sub: 0 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData();

    expect(component.ownData()).toBe(5);
    expect(component.subData()).toBe(0);
    expect(component.total()).toBe(100);
  });

  it('should calculate the ratio when the Own data is a 0%', async () => {
    (mockWorksyncService.ownSub as WritableSignal<WorksyncOwnSub>).set({ own: 0, sub: 5 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData();

    expect(component.ownData()).toBe(0);
    expect(component.subData()).toBe(5);
    expect(component.total()).toBe(0);
  });

  it('should update data when filter change', async () => {
    (mockWorksyncService.ownSub as WritableSignal<WorksyncOwnSub>).set({ own: 30, sub: 70 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData(['param1=value1']);

    expect(component.ownData()).toBe(30);
    expect(component.subData()).toBe(70);
    expect(component.total()).toBe((30 / (70 + 30)) * 100);
  });

  it('should update data when filter change for value 0', async () => {
    (mockWorksyncService.ownSub as WritableSignal<WorksyncOwnSub>).set({ own: 0, sub: 0 });
    (mockFiltersService.paramsFilter as WritableSignal<string[]>).set([]);

    await component.loadData(['param1=value1']);

    expect(component.ownData()).toBe(0);
    expect(component.subData()).toBe(0);
    expect(component.total()).toBe(0);
  });
});
