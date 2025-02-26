import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface EmployeeNameFilter {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
}

@Component({
  selector: 'optim-filter-name',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatExpansionModule, NgClass],
  templateUrl: './filter-name.component.html',
  styleUrl: './filter-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNameComponent {
  private fb = inject(FormBuilder);

  activeFilters = signal(false);

  filterByName = output<{ firstName: string | null; lastName: string | null }>();

  filterForm: FormGroup<EmployeeNameFilter> = this.initFilterForm();

  validatorMsg = 'Enter at least 3 characters or leave empty';

  private initFilterForm(): FormGroup<EmployeeNameFilter> {
    return this.fb.group({
      firstName: ['', [this.lengthValidator]],
      lastName: ['', [this.lengthValidator]],
    });
  }

  onInputChange(controlName: 'firstName' | 'lastName') {
    const control = this.filterForm.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
    this.onSubmitFilter();
  }

  onSubmitFilter() {
    if (this.filterForm.valid) {
      const filtersWithoutData = !!this.filterForm.controls.firstName.value || !!this.filterForm.controls.lastName.value;
      this.activeFilters.set(filtersWithoutData);
      this.filterByName.emit({ firstName: this.filterForm.controls.firstName.value, lastName: this.filterForm.controls.lastName.value });
    }
  }

  private lengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value.length > 2 ? null : { invalidLength: true };
  }
}
