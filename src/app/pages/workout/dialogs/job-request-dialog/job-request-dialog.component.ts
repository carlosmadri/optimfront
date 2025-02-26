import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LocationService } from '@src/app/services/location/location.service';
import { Location } from '@models/location.model';
import { SiglumService } from '@src/app/services/siglum/siglum.service';
import {
  JobRequest,
  JobRequestApprovalState,
  JobRequestCollarType,
  JobRequestForm,
  JobRequestStatus,
  JobRequestType,
  JobRequestWorkerType,
} from '@src/app/shared/models/job-request.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';
import { DialogService } from '@src/app/services/dialog-service/dialog.service';
import { ManageJobRequestService } from '@src/app/services/job-request/manage-job-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GenericDialogComponent } from '@src/app/shared/components/generic-dialog/generic-dialog.component';
import { SelectEmployeeTableComponent } from '@src/app/tables/select-employee-table/select-employee-table.component';
import { DIRECT_INDIRECT_VALUES, Employee } from '@src/app/shared/models/employee.model';

const WORKDAY_LINK = 'https://wd3.myworkday.com/ag/d/home.html';

const DIALOG_CONFIG: MatDialogConfig = {
  panelClass: 'no-border-radius-dialog',
  width: '600px',
  height: '90%',
  maxWidth: '100vw',
  maxHeight: '100vh',
};

@Component({
  selector: 'optim-job-request-dialog',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogContent,
    MatButton,
    MatIcon,
    MatDialogActions,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    SelectEmployeeTableComponent,
  ],
  templateUrl: './job-request-dialog.component.html',
  styleUrl: './job-request-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobRequestDialogComponent {
  private siglumService = inject(SiglumService);
  private locationService = inject(LocationService);
  private jobRequestService = inject(JobRequestService);
  private dialogService = inject(DialogService);
  private dialogRef = inject(MatDialogRef<JobRequestDialogComponent>);
  private manageJobRequestService = inject(ManageJobRequestService);

  @ViewChild('employeeTemplate') employeeTemplate!: TemplateRef<unknown>;

  copyCurrentDialog: MatDialogRef<GenericDialogComponent, unknown> | undefined;

  editJobRequestData = inject<JobRequest>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  locations: Signal<Location[]> = this.locationService.allLocations;

  countryChanges: Signal<string | null | undefined> = signal(null);
  siteChanges: Signal<string | null | undefined> = signal(null);
  workTypeChanges: Signal<JobRequestWorkerType | null | undefined> = signal(null);

  siteOptions = computed<string[]>(() => {
    const locations: Location[] = this.locations();
    const selectedCountry = this.countryChanges();
    if (selectedCountry) {
      return this.manageJobRequestService.getUniqueSortedSitesForCountry(locations, selectedCountry);
    }
    return [];
  });

  kapisCodeValue = computed<string>(() => {
    const locations: Location[] = this.locations();
    const selectedSite = this.siteChanges();
    if (selectedSite) {
      const location = locations.find((location) => location.site === selectedSite);
      return location?.kapisCode || '';
    }
    return '';
  });

  countryOptions = computed<string[]>(() => {
    return this.manageJobRequestService.getUniqueSortedCountries(this.locations());
  });

  allSiglums = this.siglumService.allSiglums;
  readonly today = new Date();

  isEdit = signal<boolean>(false);
  jobRequest = signal<JobRequest | null>(this.editJobRequestData);
  jrStatus = computed(() => this.jobRequest()?.status || '');

  jrTypesOptions: string[] = Object.values(JobRequestType).sort();
  jrDirectOptions: string[] = Object.values(DIRECT_INDIRECT_VALUES).sort();
  jrWorkerTypeOptions: string[] = Object.values(JobRequestWorkerType).sort();
  jrCollarTypeOptions: string[] = Object.values(JobRequestCollarType).sort();

  requiredFieldError = 'This field is required';
  workdayNumberFormat = 'Format: ######## (8 digits)';

  form = signal<FormGroup<JobRequestForm> | null>(null);

  JobRequestStatus: typeof JobRequestStatus = JobRequestStatus;

  displayApprovalStepOnEdit: JobRequestApprovalState = {
    approvedQMC: false,
    approvedSHRBPHOT1Q: false,
    approvedHOCOOHOHRCOO: false,
    approvedEmploymentCommitee: false,
  };

  constructor() {
    if (this.editJobRequestData) {
      this.isEdit.set(true);
      this.displayApprovalStepOnEdit = this.manageJobRequestService.setApprovalStep(this.displayApprovalStepOnEdit, this.editJobRequestData);

      this.form.set(this.manageJobRequestService.getFormGroup(this.editJobRequestData));
    } else {
      this.form.set(this.manageJobRequestService.getFormGroup());
    }

    this.countryChanges = toSignal(this.form()!.controls['country'].valueChanges);
    this.siteChanges = toSignal(this.form()!.controls['site'].valueChanges);
    this.workTypeChanges = toSignal(this.form()!.controls['activeWorkforce'].valueChanges);

    effect(() => {
      if (this.form()) {
        const locations: Location[] = this.locations();
        const selectedSite = this.siteChanges();
        if (selectedSite) {
          const location = locations?.find((location) => location.site === selectedSite);
          this.form()!.controls['costCenter']?.setValue(null);
          this.form()!.controls['kapisCode']?.setValue(`${location?.kapisCode}` || null);
        }
      }
    });

    effect(() => {
      if (this.form()) {
        const workType = this.workTypeChanges();

        if (this.form()) {
          this.manageJobRequestService.setWorkTypeDependentFields(this.form as WritableSignal<FormGroup<JobRequestForm>>, workType!, this.jobRequest());
        }
      }
    });
  }

  save() {
    if (this.form() && this.checkFormValidity()) {
      const jobRequest: JobRequest = this.manageJobRequestService.getFormData(this.form as Signal<FormGroup<JobRequestForm>>, this.isEdit(), this.locations());
      this.saveJobRequest(jobRequest);
    }
  }

  submit() {
    if (this.form() && this.checkFormValidity()) {
      const jobRequest: JobRequest = this.manageJobRequestService.getFormData(this.form as Signal<FormGroup<JobRequestForm>>, this.isEdit(), this.locations());
      jobRequest.status = JobRequestStatus.VALIDATION;
      this.saveJobRequest(jobRequest);
    }
  }

  private checkFormValidity(): boolean {
    if (this.form()!.invalid) {
      this.form()!.markAllAsTouched();
      return false;
    }
    return true;
  }

  async saveJobRequest(jr: JobRequest) {
    try {
      let result: JobRequest;
      if (this.isEdit()) {
        result = await this.jobRequestService.updateJobRequest(jr, jr.id.toString());
      } else {
        result = await this.jobRequestService.createJobRequest(jr);
      }
      this.dialogRef.close({ jobRequest: result, delete: false });
    } catch (error) {
      console.error('Error creating job request:', error);
      this.dialogService.openMessageDialog(`Couldn't ${this.isEdit() ? 'edit' : 'add'} new Job Request`, `Please check the form and try again.`, 'warning');
    }
  }

  delete() {
    this.dialogRef.close({ jobRequest: this.jobRequest(), delete: true });
  }

  formatDateValue(formControl: string, event: MatDatepickerInputEvent<Date>) {
    this.form()!.get(formControl)!.setValue(event.value!.toISOString());
  }

  checkKapisCode() {
    this.manageJobRequestService.checkKapisCode(this.form as Signal<FormGroup<JobRequestForm>>, this.locations());
  }

  openWorkday() {
    window.open(WORKDAY_LINK, '_blank');
  }

  openCopyCurrent() {
    this.copyCurrentDialog = this.dialog.open(GenericDialogComponent, {
      ...DIALOG_CONFIG,
      data: {
        title: 'Select an employee to copy from',
        content: this.employeeTemplate,
      },
    });
  }

  copyCurrentEmployee(employee: Employee) {
    this.copyCurrentDialog?.close();
    if (this.form()) {
      this.manageJobRequestService.setFormValuesForEmployee(employee, this.form as WritableSignal<FormGroup<JobRequestForm>>);
    }
  }
}
