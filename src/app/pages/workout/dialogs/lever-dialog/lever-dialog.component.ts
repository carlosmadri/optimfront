import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { FiltersService } from '@services/filters/filters.service';
import { Lever, LEVER_TYPES } from '@models/lever.model';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeversService } from '@services/levers/levers.service';

interface LeverForm {
  leverType: FormControl<string>;
  fte: FormControl<number | null>;
  highlights: FormControl<string>;
  startDate: FormControl<string | null>;
  startDateValue: FormControl<Moment | null>;
  endDate: FormControl<string | null>;
  endDateValue: FormControl<Moment | null>;
  // employee: FormGroup<EmployeeForm>;
  country: FormControl<string | null>;
  site: FormControl<string | null>;
  siglumDestination: FormGroup<{ id: FormControl<number | null> }>;
  siglumHR: FormControl<string | null>;
  direct: FormControl<string | null>;
  activeWorkforce: FormControl<string | null>;
  location: FormGroup<{ id: FormControl<number | null> }>;
}

enum FIELDS {
  START_DATE = 'startDateValue',
  END_DATE = 'endDateValue',
  FTE = 'fte',
  COUNTRY = 'country',
  SITE = 'site',
  ACTIVE_WORKFORCE = 'activeWorkforce',
  DIRECT = 'direct',
  SIGLUM_HR = 'siglumHR',
}

@Component({
  selector: 'optim-lever-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './lever-dialog.component.html',
  styleUrl: './lever-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeverDialogComponent implements AfterViewInit {
  leversService = inject(LeversService);
  data = inject<{ employeeFTE: number; lever: Lever | null; leverTypes: string[] }>(MAT_DIALOG_DATA);
  employeeFTE: number = this.data.employeeFTE;
  lever: Lever | null = this.data.lever;
  leverTypes = this.data.leverTypes;
  form: FormGroup<LeverForm> = this.getFormGroup();
  private filterService = inject(FiltersService);
  readonly today = new Date();
  fields = FIELDS;
  selectedLocationId!: number;
  fteWarningMsg = "FTE value plus employee's FTE value result cannot be less than 0 and more than 1";
  private formFields: { [Property in FIELDS]: boolean } = {
    startDateValue: true,
    endDateValue: true,
    fte: true,
    country: false,
    site: false,
    activeWorkforce: false,
    direct: false,
    siglumHR: false,
  };

  allCountries = computed<string[]>(() => this.filterService.getFilterValues('country'));
  allSites = signal<string[]>([]);
  allActiveWorkforce = computed<string[]>(() => this.filterService.getFilterValues('activeWorkforce'));
  allDirects = computed<string[]>(() => this.filterService.getFilterValues('direct'));
  allSiglumsHR = computed<string[]>(() => this.filterService.getAllSiglumsHR());

  showFormField = computed<Record<string, boolean>>(() => {
    return this.formFields;
  });

  constructor() {
    if (this.lever) {
      this.leversService.getLever(this.lever.id).then((lever) => {
        this.lever = lever;
        this.setEditLeverValues();
      });
    }
  }

  private getFormGroup(): FormGroup<LeverForm> {
    const employeeFG = new FormGroup({
      impersonal: new FormControl<boolean | null>(this.leverTypes.includes(LEVER_TYPES.REDEPLOYMENT)),
    });
    const leverFG = new FormGroup({
      leverType: new FormControl<string | null>(this.lever?.leverType ?? null, Validators.required),
      fte: new FormControl<number | null>(this.lever?.fte ?? null, Validators.required),
      highlights: new FormControl<string | null>(this.lever?.highlights ?? null),
      startDate: new FormControl<string | null>(this.lever?.startDate ?? null),
      startDateValue: new FormControl<string | null>(this.lever?.startDate ?? null, Validators.required),
      endDate: new FormControl<string | null>(this.lever?.endDate ?? null),
      endDateValue: new FormControl<string | null>(this.lever?.endDate ?? null, Validators.required),
      employee: employeeFG,
      country: new FormControl<string | null>(this.lever?.costCenter?.location?.country ?? null),
      site: new FormControl<string | null>(this.lever?.costCenter?.location?.site ?? null),
      siglumDestination: new FormGroup({ id: new FormControl<number | null>(this.lever?.siglumDestination?.id ?? null) }),
      siglumHR: new FormControl<string | null>(this.lever?.siglumDestination?.siglumHR ?? null),
      direct: new FormControl<string | null>(null),
      activeWorkforce: new FormControl<string | null>(this.lever?.activeWorkforce ?? null),
      location: new FormGroup({ id: new FormControl<number | null>(this.lever?.costCenter?.location?.id ?? null) }),
    } as LeverForm);

    return leverFG;
  }

  private setEditLeverValues() {
    if (this.lever) {
      this.form.controls.leverType.setValue(this.lever.leverType);
      this.form.controls.leverType.disable();
      this.form.controls.country.setValue(this.lever.costCenter?.location?.country ?? null);
      this.form.controls.site.setValue(this.lever.costCenter?.location?.site ?? null);
      this.form.controls.direct.setValue(this.lever.direct);
      this.form.controls.siglumHR.setValue(this.lever.siglumDestination?.siglumHR);
      this.form.updateValueAndValidity();
    }
  }

  formatDateValue(formControl: string, event: MatDatepickerInputEvent<Moment>) {
    this.form.get(formControl)!.setValue(event.value!.toISOString());
  }

  siglumSelected(siglumHR: string) {
    const siglumId = this.filterService.getSiglumId(siglumHR);
    this.form.controls.siglumDestination.controls.id.setValue(siglumId);
  }

  private enableFormField(fg: FormGroup, field: FIELDS) {
    fg.get(field)!.setValidators([Validators.required]);
    this.formFields[field] = true;
  }

  private disableFormField(fg: FormGroup, field: FIELDS) {
    fg.get(field)!.clearValidators();
    this.formFields[field] = false;
    if (!this.lever) {
      fg.get(field)!.setValue(null);
    }
  }

  private enableFTEValue() {
    this.form.controls.fte.enable();
    this.form.controls.fte.setValidators([
      Validators.max(this.maxFTE),
      Validators.min(this.minFTE),
      Validators.pattern(/^-?(\d+(\.\d{0,1})?|\.\d{1})$/),
      Validators.required,
    ]);
    this.fteWarningMsg = `FTE value must be between ${this.minFTE} and ${this.maxFTE}, not including 0. One decimal is allowed.`;
  }

  private get minFTE() {
    if (this.employeeFTE === 0 || this.isImpersonal()) {
      return -1;
    }
    return -1 * this.employeeFTE;
  }

  private get maxFTE() {
    if (this.employeeFTE === 0 || this.isImpersonal()) {
      return 1;
    }
    return (100 - Number(this.employeeFTE.toFixed(2)) * 100) / 100;
  }

  private isImpersonal() {
    return this.form.controls['leverType'].value === LEVER_TYPES.REDEPLOYMENT || this.form.controls['leverType'].value === LEVER_TYPES.PERIMETER_CHANGE;
  }

  formDefaultState() {
    this.disableFormField(this.form, FIELDS.COUNTRY);
    this.disableFormField(this.form, FIELDS.SITE);
    this.disableFormField(this.form, FIELDS.ACTIVE_WORKFORCE);
    this.disableFormField(this.form, FIELDS.DIRECT);
    this.enableFormField(this.form, FIELDS.END_DATE);
    this.enableFormField(this.form, FIELDS.FTE);
    this.disableFormField(this.form, FIELDS.SIGLUM_HR);
    if (!this.lever) {
      this.form.controls.endDate.setValue(null);
      this.form.controls.endDateValue.setValue(null);
      this.form.controls.siglumDestination.controls.id.setValue(null);
      this.form.controls.fte.setValue(this.minFTE);
    }
    this.form.controls.fte.disable();
    this.form.controls.site.disable();
  }

  ngAfterViewInit() {
    this.form.controls.country.valueChanges.subscribe((value) => {
      if (value) {
        this.allSites.set(this.filterService.getFilterValues(FIELDS.SITE, [value!]));
        this.form.controls.site.enable();
      } else {
        this.form.controls.site.disable();
      }
    });
    this.form.controls.site.valueChanges.subscribe((value) => {
      if (value) {
        this.selectedLocationId = this.filterService.getLocationId(value);
        this.form.controls.location.controls.id.setValue(this.selectedLocationId);
      }
    });
    this.form.controls.leverType.valueChanges.subscribe((type) => {
      this.formDefaultState();
      switch (type) {
        case LEVER_TYPES.INTERNAL_MOBILITY:
          this.enableFormField(this.form, FIELDS.SIGLUM_HR);
          this.disableFormField(this.form, FIELDS.END_DATE);
          this.form.controls.endDateValue.setValue(null);
          break;
        case LEVER_TYPES.TEMP_RENOVATION:
          this.disableFormField(this.form, FIELDS.FTE);
          this.form.controls.fte.setValue(0);
          break;
        case LEVER_TYPES.SHIFT_CHANGE:
          this.enableFTEValue();
          break;
        case LEVER_TYPES.LEASED:
          this.enableFTEValue();
          break;
        case LEVER_TYPES.MOBILITY_OUT:
        case LEVER_TYPES.RETIREMENT:
        case LEVER_TYPES.TEMP_RELEASE:
        case LEVER_TYPES.PRE_RETIREMENT:
          this.disableFormField(this.form, FIELDS.END_DATE);
          this.form.controls.endDateValue.setValue(null);
          break;
        case LEVER_TYPES.BORROWED:
          this.enableFTEValue();
          this.formFields[FIELDS.COUNTRY] = true;
          this.formFields[FIELDS.SITE] = true;
          this.formFields[FIELDS.ACTIVE_WORKFORCE] = true;
          this.formFields[FIELDS.DIRECT] = true;
          break;
        case LEVER_TYPES.PERIMETER_CHANGE:
        case LEVER_TYPES.REDEPLOYMENT:
          this.enableFTEValue();
          this.enableFormField(this.form, FIELDS.SIGLUM_HR);
          this.disableFormField(this.form, FIELDS.END_DATE);
          this.form.controls.endDateValue.setValue(null);
          this.enableFormField(this.form, FIELDS.COUNTRY);
          this.enableFormField(this.form, FIELDS.SITE);
          this.enableFormField(this.form, FIELDS.ACTIVE_WORKFORCE);
          this.enableFormField(this.form, FIELDS.DIRECT);
          break;
        default:
          break;
      }
      this.form.updateValueAndValidity();
    });
    this.setEditLeverValues();
  }
}
