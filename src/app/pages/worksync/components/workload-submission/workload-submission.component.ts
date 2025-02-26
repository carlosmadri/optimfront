import { ChangeDetectionStrategy, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GenericDialogComponent } from '@src/app/shared/components/generic-dialog/generic-dialog.component';
import { SiglumSelectionComponent } from '@src/app/shared/components/siglum-selection/siglum-selection.component';
import { WorkloadUploadComponent } from '@src/app/shared/components/workload-upload/workload-upload.component';

const DIALOG_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '800px',
  height: '70%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

const CONFIRM_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '30%',
  height: '25%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

@Component({
  selector: 'optim-workload-submission',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SiglumSelectionComponent, WorkloadUploadComponent],
  templateUrl: './workload-submission.component.html',
  styleUrl: './workload-submission.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadSubmissionComponent {
  readonly dialog = inject(MatDialog);
  selectSiglumDialog: MatDialogRef<GenericDialogComponent, unknown> | undefined;
  uploadDialog: MatDialogRef<GenericDialogComponent, unknown> | undefined;

  @ViewChild('submitTemplate') submitTemplate!: TemplateRef<unknown>;
  @ViewChild('validateTemplate') validateTemplate!: TemplateRef<unknown>;
  @ViewChild('uploadTemplate') uploadTemplate!: TemplateRef<unknown>;

  validateSiglums(siglums: { selectedSiglums: unknown[]; rejectedSiglums: unknown[] }) {
    console.log('validate', siglums);
    this.selectSiglumDialog?.close();
  }

  submitSiglums(siglums: { selectedSiglums: unknown[]; rejectedSiglums: unknown[] }) {
    console.log('submit', siglums);
    this.selectSiglumDialog?.close();
  }

  openSubmitDialog() {
    this.selectSiglumDialog = this.dialog.open(GenericDialogComponent, {
      ...DIALOG_CONFIG,
      data: {
        title: 'Submit teams',
        content: this.submitTemplate,
      },
    });
  }

  openValidateDialog() {
    this.selectSiglumDialog = this.dialog.open(GenericDialogComponent, {
      ...DIALOG_CONFIG,
      data: {
        title: 'Validate teams',
        content: this.validateTemplate,
      },
    });
  }

  openUploadDialog() {
    this.uploadDialog = this.dialog.open(GenericDialogComponent, {
      ...CONFIRM_CONFIG,
      data: {
        title: 'Confirm upload',
        content: this.uploadTemplate,
      },
    });
  }

  uploadFile(file: File) {
    this.uploadDialog?.close();
    console.log('file', file);
  }
}
