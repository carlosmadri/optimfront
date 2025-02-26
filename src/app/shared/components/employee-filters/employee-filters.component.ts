import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { ClickStopPropagationDirective } from '@app/shared/directives/click-stop-propagation/click-stop-propagation.directive';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeFilter, FiltersService } from '@services/filters/filters.service';
import { MatInputModule } from '@angular/material/input';

export interface EmployeeFormFilter {
  siglumHR: FormControl<string[]>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  country: FormControl<string[]>;
  site: FormControl<string[]>;
  direct: FormControl<string[]>;
  activeWorkforce: FormControl<string[]>;
  availabilityReason: FormControl<string[]>;
  contractType: FormControl<string[]>;
  job: FormControl<string | null>;
  WCBC: FormControl<string | null>;
  FTE: FormControl<number | null>;
}

@Component({
  selector: 'optim-employee-filters',
  standalone: true,
  imports: [
    ClickStopPropagationDirective,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatFabButton,
    MatInputModule,
  ],
  templateUrl: './employee-filters.component.html',
  styleUrl: './employee-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFiltersComponent implements AfterViewInit {
  private filterService = inject(FiltersService);
  form: FormGroup<EmployeeFormFilter> = this.getFormGroup();
  activeFilters = output<boolean>();
  allSiglumsHR = computed<string[]>(() => this.filterService.getAllSiglumsHR());
  allDirects = computed<string[]>(() => this.filterService.getFilterValues('direct'));
  allActiveWorkforce = computed<string[]>(() => this.filterService.getFilterValues('activeWorkforce'));
  allAvailabilityReason = computed<string[]>(() => this.filterService.getAlternativeFilterValues('availabilityReason'));
  allContractType = computed<string[]>(() => this.filterService.getAlternativeFilterValues('contractType'));
  allCountries = computed<string[]>(() => this.filterService.getFilterValues('country'));
  allSites = computed<string[]>(() => this.sites());
  sites = signal<string[]>([]);

  private getFormGroup(): FormGroup<EmployeeFormFilter> {
    const fg = new FormGroup({
      siglumHR: new FormControl<string[]>([]),
      firstName: new FormControl<string | null>(null),
      lastName: new FormControl<string | null>(null),
      country: new FormControl<string[]>([]),
      site: new FormControl<string[]>([]),
      direct: new FormControl<string[]>([]),
      activeWorkforce: new FormControl<string[]>([]),
      availabilityReason: new FormControl<string[]>([]),
      contractType: new FormControl<string[]>([]),
      job: new FormControl<string | null>(null),
      WCBC: new FormControl<string | null>(null),
      FTE: new FormControl<number | null>(null),
    } as EmployeeFormFilter);

    return fg;
  }

  ngAfterViewInit() {
    this.sites.set(this.filterService.getFilterValues('site'));
    this.form.controls.country.valueChanges.subscribe((value) => {
      if (value) {
        this.sites.set(this.filterService.getFilterValues('site', value));
      }
    });
  }

  get hasActiveFilters() {
    return this.filterService.employeeFilter().length > 0;
  }

  onSubmit() {
    this.filterService.updateEmployeeFilter(this.form.value as EmployeeFilter);
    this.activeFilters.emit(this.hasActiveFilters);
  }

  onClear() {
    this.filterService.clearEmployeeFilters();
    this.form.reset();
    this.activeFilters.emit(false);
  }
}
