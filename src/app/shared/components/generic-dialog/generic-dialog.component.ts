import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'optim-generic-dialog',
  standalone: true,
  imports: [MatDialogClose, MatDialogContent, MatIcon, MatIconButton, CommonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDialogComponent {
  data: { title: string; content: TemplateRef<unknown> } = inject(MAT_DIALOG_DATA);
}
