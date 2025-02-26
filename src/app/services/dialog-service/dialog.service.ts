import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent, MessageDialogType } from '@components/message-dialog/message-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly dialog = inject(MatDialog);

  /**
   * @param {string} title - Title of the dialog.
   * @param {string} content - Description/content of the dialog
   * @returns {Promise<boolean | null>} Returns True when the user accepts by clicking the confirmation button
   */
  async openConfirmationDialog(title: string, content: string): Promise<boolean | null> {
    const dialog$ = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title,
          content,
        },
      })
      .afterClosed();
    return firstValueFrom(dialog$);
  }
  /**
   * @param {string}  title - Title of the dialog.
   * @param {string} content - Message of the dialog.
   * @param {MessageDialogType} type - There are three (3) different types
   * info, warning and error. Each has its own icon
   * @returns {Promise<null>} Returns an empty promise when closed.
   */
  async openMessageDialog(title: string, content: string, type: MessageDialogType): Promise<null> {
    const dialog$ = this.dialog
      .open(MessageDialogComponent, {
        data: {
          title,
          content,
          type,
        },
      })
      .afterClosed();
    return firstValueFrom(dialog$);
  }
}
