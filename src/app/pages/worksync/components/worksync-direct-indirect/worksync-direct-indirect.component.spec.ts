import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksyncDirectIndirectComponent } from './worksync-direct-indirect.component';
import { WorksyncService } from '@src/app/services/worksync/worksync.service';
import { FiltersService } from '@src/app/services/filters/filters.service';
import { DirectIndirect } from '@src/app/shared/models/employee.model';
import { signal } from '@angular/core';

describe('WorksyncDirectIndirectComponent', () => {
  let component: WorksyncDirectIndirectComponent;
  let fixture: ComponentFixture<WorksyncDirectIndirectComponent>;
  let mockWorksyncService: Partial<WorksyncService>;
  let mockFiltersService: Partial<FiltersService>;

  const initialDirectIndirect: DirectIndirect = { direct: 100, indirect: 50 };

  beforeEach(async () => {
    mockWorksyncService = {
      directRatio: signal<DirectIndirect>(initialDirectIndirect),
      getDirectRatio: jest.fn(),
    };

    mockFiltersService = {
      paramsFilter: signal<string[]>([]),
    };

    await TestBed.configureTestingModule({
      imports: [WorksyncDirectIndirectComponent],
      providers: [
        { provide: WorksyncService, useValue: mockWorksyncService },
        { provide: FiltersService, useValue: mockFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksyncDirectIndirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
