import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersService } from '@services/filters/filters.service';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisableFilterOptionDirective } from '@app/shared/directives/disable-filter-option/disable-filter-option.directive';
import { pairwise, startWith } from 'rxjs';
import { LOCATION_TYPES } from '@models/location.model';
import { ClickStopPropagationDirective } from '@app/shared/directives/click-stop-propagation/click-stop-propagation.directive';

export interface FormFilter {
  field: FormControl<string>;
  values: FormControl<string[]>;
  formFields: FormControl<string[]>;
  formValues: FormControl<string[]>;
}

@Component({
  selector: 'optim-general-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatFabButton,
    DisableFilterOptionDirective,
    ClickStopPropagationDirective,
  ],
  templateUrl: './general-filter.component.html',
  styleUrl: './general-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralFilterComponent {
  filterService = inject(FiltersService);
  elementRef = inject(ElementRef);

  formFilters: FormGroup<FormFilter>[] = [];
  activeFilters = output<boolean>();
  closeFilters = output<boolean>();
  selectedFields: string[] = [];
  selectedCountries: string[] = [];
  disableAddFilter = false;
  overlayIsPresent = false;

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && !this.overlayIsPresent) {
      this.closeFilters.emit(true);
    }
  }

  constructor() {
    this.filterService.initializeFilters();
    this.addForm();
  }

  addForm() {
    this.formFilters.push(this.getFormGroup());
    this.disableAddFilter = true;
  }

  clearFilters() {
    this.selectedFields = [];
    this.selectedCountries = [];
    this.formFilters = [];
    this.activeFilters.emit(false);
    this.filterService.clearFilters();
    this.addForm();
  }

  private getFormGroup(): FormGroup<FormFilter> {
    const fg = new FormGroup({
      field: new FormControl<string>(''),
      values: new FormControl<string[]>([]),
      formFields: new FormControl<string[]>(this.getFields()),
      formValues: new FormControl<string[]>([]),
    } as FormFilter);
    fg.controls.field.valueChanges.pipe(startWith(null), pairwise()).subscribe(([oldValue, value]) => {
      fg.controls.formValues.setValue(this.filterService.getFilterValues(value!, this.selectedCountries));
      this.selectedFields.push(value!);
      if (oldValue) {
        this.filterService.removeGeneralFilter(oldValue);
        if (oldValue === LOCATION_TYPES.COUNTRY) {
          this.selectedCountries = [];
        }
        this.selectedFields = this.selectedFields.filter((field) => field !== oldValue);
      }
    });
    return fg;
  }

  valueSelected(event: MatSelectChange, form: FormGroup<FormFilter>) {
    const field = form.value.field!;
    if (field === LOCATION_TYPES.COUNTRY) {
      this.selectedCountries = event.value;
    }
    this.filterService.updateGeneralFilter(field, event.value);
    this.activeFilters.emit(this.filterService.generalFilter().length > 0);
    this.disableAddFilter = (event.value as string[]).length === 0;
  }

  private getFields(): string[] {
    return this.filterService.getFilterFields().filter((field) => !this.selectedFields.includes(field));
  }

  onSelectFieldOpen(opened: boolean, form: FormGroup<FormFilter>) {
    this.overlayIsPresent = opened;
    if (opened) {
      const fields = this.getFields();
      if (form.controls.field.value) {
        fields.unshift(form.controls.field.value);
      }
      form.controls.formFields.setValue(fields);
    }
  }

  onSelectValueOpen(opened: boolean, form: FormGroup<FormFilter>) {
    this.overlayIsPresent = opened;
    if (opened) {
      form.controls.formValues.setValue(this.filterService.getFilterValues(form.controls.field.value, this.selectedCountries));
    }
  }

  deleteFilter(form: FormGroup<FormFilter>) {
    const field = form.controls.field.value;
    if (field === LOCATION_TYPES.COUNTRY) {
      this.selectedCountries = [];
    }
    this.filterService.removeGeneralFilter(field);
    this.formFilters = this.formFilters.filter((formFilter) => formFilter !== form);
    this.selectedFields = this.selectedFields.filter((fieldValue) => fieldValue !== field);
    form.controls.field.enable();
    this.activeFilters.emit(this.filterService.generalFilter().length > 0);
    this.disableAddFilter = false;
  }
}
