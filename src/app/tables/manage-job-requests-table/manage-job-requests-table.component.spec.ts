import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobRequestsTableComponent } from './manage-job-requests-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ManageJobRequestsTableComponent', () => {
  let component: ManageJobRequestsTableComponent;
  let fixture: ComponentFixture<ManageJobRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageJobRequestsTableComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageJobRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
