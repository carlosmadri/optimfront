import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkloadTableComponent } from './manage-workload-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManageWorkloadTableComponent', () => {
  let component: ManageWorkloadTableComponent;
  let fixture: ComponentFixture<ManageWorkloadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWorkloadTableComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageWorkloadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
