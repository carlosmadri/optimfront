import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'optim-workload-upload',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './workload-upload.component.html',
  styleUrl: './workload-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkloadUploadComponent {
  upload = output<File>();

  file: File | null = null;

  onUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  submit() {
    if (this.file) {
      this.upload.emit(this.file);
    }
  }
}
