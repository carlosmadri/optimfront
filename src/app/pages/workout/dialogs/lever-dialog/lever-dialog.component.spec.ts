import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeverDialogComponent } from './lever-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('LeverDialogComponent', () => {
  let component: LeverDialogComponent;
  let fixture: ComponentFixture<LeverDialogComponent>;
  const mockDate = {
    employeeFTE: 0,
    lever: null,
    leverTypes: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeverDialogComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNativeDateAdapter(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDate,
        },
        {
          provide: MatDialogRef,
          useValue: mockDate,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
