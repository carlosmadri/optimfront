import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MessageDialogComponent } from '@components/message-dialog/message-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { describe, expect, test } from '@jest/globals';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent, MessageDialogComponent, MatDialogModule],
    });
    service = TestBed.inject(DialogService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
