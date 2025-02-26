import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

export type MessageDialogType = 'info' | 'warning' | 'error';

export interface MessageDialogData {
  title: string;
  content: string;
  type: MessageDialogType;
}

@Component({
  selector: 'optim-message-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatIcon],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss',
})
export class MessageDialogComponent {
  readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
}
