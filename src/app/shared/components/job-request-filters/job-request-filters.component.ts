import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FiltersService, JobRequestFilter } from '@services/filters/filters.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerToggle } from '@angular/material/datepicker';
import { Moment } from 'moment/moment';
import { JobRequestStatus, JobRequestWorkerType } from '@models/job-request.model';

export interface JoRequestFormFilter {
  siglumHR: FormControl<string[]>;
  workdayNumber: FormControl<string | null>;
  status: FormControl<string[]>;
  workerType: FormControl<string[]>;
  startDate: FormControl<string | null>;
}

@Component({
  selector: 'optim-job-request-filters',
  standalone: true,
  imports: [
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatFabButton,
    MatInputModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
  ],
  templateUrl: './job-request-filters.component.html',
  styleUrl: './job-request-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobRequestFiltersComponent {
  private filterService = inject(FiltersService);
  form: FormGroup<JoRequestFormFilter> = this.getFormGroup();
  activeFilters = output<boolean>();
  allSiglumsHR = computed<string[]>(() => this.filterService.getAllSiglumsHR());
  allActiveWorkforce = computed<string[]>(() => Object.values(JobRequestWorkerType));
  allJRStatus = computed<string[]>(() => Object.values(JobRequestStatus));
  readonly today = new Date();

  private getFormGroup(): FormGroup<JoRequestFormFilter> {
    const fg = new FormGroup({
      siglumHR: new FormControl<string[]>([]),
      workdayNumber: new FormControl<string | null>(null),
      status: new FormControl<string[]>([]),
      workerType: new FormControl<string[]>([]),
      startDate: new FormControl<string | null>(null),
    } as JoRequestFormFilter);

    return fg;
  }

  get hasActiveFilters() {
    return this.filterService.jobRequestFilter().length > 0;
  }

  formatDateValue(formControl: string, event: MatDatepickerInputEvent<Moment>) {
    this.form.get(formControl)!.setValue(event.value!.toISOString());
  }

  onSubmit() {
    this.filterService.updateJobRequestFilter(this.form.value as JobRequestFilter);
    this.activeFilters.emit(this.hasActiveFilters);
  }

  onClear() {
    this.filterService.clearJobRequestFilters();
    this.form.reset();
    this.activeFilters.emit(false);
  }
}
