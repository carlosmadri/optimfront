import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamsComponent } from './manage-teams.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeDialogComponent } from '../dialogs/employee-dialog/employee-dialog.component';
import { MockWorkoutEmployeeDialogComponent } from '@src/app/mocks/components';
import { MatDialogModule } from '@angular/material/dialog';

describe('ManageTeamsComponent', () => {
  let component: ManageTeamsComponent;
  let fixture: ComponentFixture<ManageTeamsComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(ManageTeamsComponent, {
      remove: {
        imports: [EmployeeDialogComponent],
      },
      add: {
        imports: [MockWorkoutEmployeeDialogComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [ManageTeamsComponent, NoopAnimationsModule, MatDialogModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
