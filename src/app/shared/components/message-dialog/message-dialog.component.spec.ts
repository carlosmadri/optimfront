import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageDialogComponent, MessageDialogData } from './message-dialog.component';

describe('MessageDialogComponent', () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;

  const msgDialogMock: MessageDialogData = {
    type: 'info',
    content: 'Test',
    title: 'test',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: msgDialogMock },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
