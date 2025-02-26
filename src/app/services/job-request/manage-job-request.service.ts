import { Injectable, Signal, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import {
  JobRequest,
  JobRequestApprovalState,
  JobRequestCollarType,
  JobRequestForm,
  JobRequestStatus,
  JobRequestType,
  JobRequestWorkerType,
} from '@src/app/shared/models/job-request.model';
import { Location } from '@models/location.model';
import { Siglum } from '@src/app/shared/models/siglum.model';
import { CostCenter } from '@src/app/shared/models/cost-center.model';
import { DIRECT_INDIRECT_VALUES, Employee } from '@src/app/shared/models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class ManageJobRequestService {
  getFormGroup(jobRequest?: JobRequest): FormGroup<JobRequestForm> {
    const inValidation = this.inValidation(jobRequest!);

    const formControls = {
      id: new FormControl<number | null>(jobRequest?.id || null),
      status: new FormControl<JobRequestStatus | null>(jobRequest?.status || null),
      postingDate: new FormControl<string | null>(jobRequest?.postingDate || null),
      type: new FormControl<JobRequestType | null>({ value: jobRequest?.type || JobRequestType.REPLACEMENT, disabled: inValidation }, Validators.required),
      siglum: new FormControl<number | null>({ value: jobRequest?.siglum?.id || null, disabled: inValidation }, Validators.required),
      description: new FormControl<string | null>({ value: jobRequest?.description || null, disabled: inValidation }, Validators.required),
      workdayNumber: new FormControl<string | null>(
        jobRequest?.workdayNumber ? jobRequest.workdayNumber.toLowerCase().replace(/jr/gi, '') : null,
        Validators.pattern(/^\d{8}$/),
      ),
      candidate: new FormControl<string | null>(jobRequest?.candidate || null),
      direct: new FormControl<DIRECT_INDIRECT_VALUES | null>({ value: jobRequest?.direct || null, disabled: inValidation }, Validators.required),
      activeWorkforce: new FormControl<JobRequestWorkerType | null>(
        { value: jobRequest?.activeWorkforce || null, disabled: inValidation },
        Validators.required,
      ),
      country: new FormControl<string | null>({ value: jobRequest?.location?.country || null, disabled: inValidation }, Validators.required),
      site: new FormControl<string | null>({ value: jobRequest?.location?.site || null, disabled: inValidation }, Validators.required),
      kapisCode: new FormControl<string | null>({ value: jobRequest?.location?.kapisCode || null, disabled: inValidation }, [
        Validators.required,
        Validators.pattern('^[0-9]{4}$'),
      ]),
      costCenter: new FormControl<CostCenter | null>({ value: jobRequest?.costCenter || null, disabled: true }),
      collar: new FormControl<JobRequestCollarType | null>({ value: jobRequest?.collar || null, disabled: inValidation }, Validators.required),
      startDate: new FormControl<string | null>({ value: jobRequest?.startDate || null, disabled: inValidation }, Validators.required),
      onTopHct: new FormControl<boolean>({ value: jobRequest?.onTopHct || false, disabled: inValidation }, Validators.required),
      external: new FormControl<boolean | null>(
        {
          value: jobRequest?.external !== undefined ? jobRequest.external : false,
          disabled: true,
        },
        Validators.required,
      ),
      earlyCareer: new FormControl<boolean | null>(
        { value: jobRequest?.earlyCareer !== undefined ? jobRequest.earlyCareer : null, disabled: inValidation },
        Validators.required,
      ),
      isCritical: new FormControl<boolean | null>(
        { value: jobRequest?.isCritical !== undefined ? jobRequest.isCritical : null, disabled: inValidation },
        Validators.required,
      ),
      approvedQMC: new FormControl<boolean | null>(
        { value: jobRequest?.approvedQMC || false, disabled: jobRequest?.status !== JobRequestStatus.VALIDATION },
        Validators.required,
      ),
      approvedSHRBPHOT1Q: new FormControl<boolean | null>(
        { value: jobRequest?.approvedSHRBPHOT1Q || false, disabled: jobRequest?.status !== JobRequestStatus.QMC_APPROVED },
        Validators.required,
      ),
      approvedHOCOOHOHRCOO: new FormControl<boolean | null>(
        { value: jobRequest?.approvedHOCOOHOHRCOO || false, disabled: jobRequest?.status !== JobRequestStatus.SHRBP_HO_T1Q_APPROVED },
        Validators.required,
      ),
      approvedEmploymentCommitee: new FormControl<boolean | null>(
        { value: jobRequest?.approvedEmploymentCommitee || false, disabled: jobRequest?.status !== JobRequestStatus.COO_APPROVED },
        Validators.required,
      ),
    };

    const form = new FormGroup<JobRequestForm>(formControls);

    if (jobRequest) {
      this.initFormValues(jobRequest!, form);
    }

    return form;
  }

  private initFormValues(jobRequest: JobRequest, form: FormGroup<JobRequestForm>) {
    form.controls['country'].setValue(jobRequest.location?.country);

    this.setDefaultValuesForWorkerType(jobRequest, form);

    this.checkExternalStatus(form, jobRequest);
  }

  checkExternalStatus(form: FormGroup<JobRequestForm>, jobRequest: JobRequest) {
    if (jobRequest.status === JobRequestStatus.OPENED) {
      const postingDate = new Date(jobRequest.postingDate);
      const today = new Date();
      const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
      if (postingDate < twoWeeksAgo) {
        form.controls['external'].enable();
      }
    }
  }

  private setDefaultValuesForWorkerType(jobRequest: JobRequest, form: FormGroup<JobRequestForm>) {
    if (jobRequest.activeWorkforce === JobRequestWorkerType.TEMP) {
      form.controls['external'].setValue(true);
      form.controls['earlyCareer'].setValue(true);
      this.addFormControl(form, 'releaseDate', new FormControl<string | null>(jobRequest.releaseDate || null, Validators.required));
    }
  }

  getFormData(form: Signal<FormGroup<JobRequestForm>>, isEdit: boolean, locations: Location[]): JobRequest {
    const formValue = form().getRawValue();
    const jobRequest: JobRequest = {
      id: formValue.id!,
      postingDate: new Date().toISOString(),
      type: formValue.type!,
      status: this.getJobRequestStatus(form, isEdit) || JobRequestStatus.ON_HOLD,
      siglum: { id: +formValue.siglum! } as Siglum,
      description: formValue.description!,
      workdayNumber: formValue.workdayNumber ? `JR${formValue.workdayNumber}` : '',
      candidate: formValue.candidate!,
      direct: formValue.direct!,
      activeWorkforce: formValue.activeWorkforce!,
      location: {
        id: this.getSiteId(locations, formValue.site!),
      } as Location,
      kapisCode: formValue.kapisCode!,
      costCenter: formValue.costCenter!,
      collar: formValue.collar!,
      startDate: formValue.startDate!,
      releaseDate: formValue.releaseDate!,
      onTopHct: formValue.onTopHct!,
      external: formValue.external!,
      earlyCareer: formValue.earlyCareer!,
      isCritical: formValue.isCritical!,
      approvedQMC: formValue.approvedQMC!,
      approvedSHRBPHOT1Q: formValue.approvedSHRBPHOT1Q!,
      approvedHOCOOHOHRCOO: formValue.approvedHOCOOHOHRCOO!,
      approvedEmploymentCommitee: formValue.approvedEmploymentCommitee!,
    };

    return jobRequest;
  }

  getJobRequestStatus(form: Signal<FormGroup<JobRequestForm>>, isEdit: boolean): JobRequestStatus | null {
    if (isEdit) {
      const formValue = form().getRawValue();
      if (this.jrAlreadyFilled(form())) {
        return JobRequestStatus.FILLED;
      } else if (formValue.approvedEmploymentCommitee) {
        return JobRequestStatus.OPENED;
      } else if (this.approvalCompleted(form())) {
        return JobRequestStatus.OPENED;
      } else if (formValue.approvedHOCOOHOHRCOO) {
        return JobRequestStatus.COO_APPROVED;
      } else if (formValue.approvedSHRBPHOT1Q) {
        return JobRequestStatus.SHRBP_HO_T1Q_APPROVED;
      } else if (formValue.approvedQMC) {
        return JobRequestStatus.QMC_APPROVED;
      } else if (formValue.status === JobRequestStatus.VALIDATION) {
        return JobRequestStatus.VALIDATION;
      }
    }
    return null;
  }

  getUniqueSortedCountries(data: Location[]): string[] {
    const uniqueCountries = [...new Set(data.map((item) => item.country))];
    return uniqueCountries.sort((a, b) => a.localeCompare(b));
  }

  getUniqueSortedSitesForCountry(data: Location[], country: string): string[] {
    const uniqueSites = [...new Set(data.filter((item) => item.country === country).map((item) => item.site))];
    return uniqueSites.sort((a, b) => a.localeCompare(b));
  }

  getSiteId(locations: Location[], site: string): number {
    const locationSite = locations.find((location) => location.site === site);
    return locationSite!.id;
  }

  checkKapisCode(form: Signal<FormGroup<JobRequestForm>>, locations: Location[]): void {
    const kapisCode = form().controls['kapisCode'].value;
    if (kapisCode && kapisCode.length === 4) {
      const location = locations.find((location) => location.kapisCode === kapisCode);
      if (location) {
        form().controls['country'].setValue(location.country);
        form().controls['site'].setValue(location.site);
        form().controls['costCenter'].setValue(null);
        return;
      }
    }
    form().controls['country'].setValue(null);
    form().controls['site'].setValue(null);
  }

  addFormControl<K extends keyof JobRequestForm>(form: FormGroup<JobRequestForm>, controlName: K, control: JobRequestForm[K]) {
    form.setControl(controlName, control);
  }

  removeFormControl<K extends keyof JobRequestForm>(form: FormGroup<JobRequestForm>, controlName: K) {
    (form as FormGroup).removeControl(controlName);
  }

  updateValidation<K extends keyof JobRequestForm>(form: FormGroup<JobRequestForm>, controlName: K, validators: ValidatorFn | ValidatorFn[] | null) {
    const control = form.get(controlName);
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  setWorkTypeDependentFields(form: WritableSignal<FormGroup<JobRequestForm>>, workType: JobRequestWorkerType, jobRequest: JobRequest | null) {
    if (jobRequest && this.inValidation(jobRequest)) {
      this.addFormControl(
        form(),
        'releaseDate',
        new FormControl<string | null>({ value: jobRequest?.releaseDate || null, disabled: true }, Validators.required),
      );
    } else if (workType === JobRequestWorkerType.TEMP) {
      form().controls['earlyCareer'].setValue(true);
      form().controls['external'].setValue(true);
      this.addFormControl(form(), 'releaseDate', new FormControl<string | null>(jobRequest?.releaseDate || null, Validators.required));
    } else if (workType === JobRequestWorkerType.AWF) {
      if (form().controls['earlyCareer'].value === true) {
        form().controls['earlyCareer'].setValue(null);
      }
      form().controls['external'].setValue(false);
      this.removeFormControl(form(), 'releaseDate');
    }
  }

  private inValidation(jobRequest: JobRequest): boolean {
    if (jobRequest?.status && jobRequest.status !== JobRequestStatus.ON_HOLD) {
      return true;
    }
    return false;
  }

  setApprovalStep(displayApprovalStep: JobRequestApprovalState, jobRequest: JobRequest): JobRequestApprovalState {
    const steps = { ...displayApprovalStep };
    steps.approvedQMC = true;
    if (jobRequest.approvedQMC) {
      steps.approvedSHRBPHOT1Q = true;
    }
    if (jobRequest.approvedSHRBPHOT1Q && !this.jrTempNotOnTopHtcComplete(jobRequest)) {
      steps.approvedHOCOOHOHRCOO = true;
    } else if (this.jrTempNotOnTopHtcComplete(jobRequest)) {
      return steps;
    }
    if (jobRequest.approvedHOCOOHOHRCOO && !this.jrIsCriticalComplete(jobRequest)) {
      steps.approvedEmploymentCommitee = true;
    } else if (this.jrIsCriticalComplete(jobRequest)) {
      return steps;
    }
    if (jobRequest.approvedEmploymentCommitee) {
      steps.approvedEmploymentCommitee = true;
    }
    return steps;
  }

  private approvalCompleted(form: FormGroup<JobRequestForm>): boolean {
    const formValues = form.getRawValue();
    const jobRequest: Partial<JobRequest> = {
      activeWorkforce: formValues.activeWorkforce!,
      isCritical: formValues.isCritical!,
      onTopHct: formValues.onTopHct!,
      approvedSHRBPHOT1Q: formValues.approvedSHRBPHOT1Q!,
      approvedHOCOOHOHRCOO: formValues.approvedHOCOOHOHRCOO!,
      approvedEmploymentCommitee: formValues.approvedEmploymentCommitee!,
      candidate: formValues.candidate!,
      status: formValues.status!,
    };
    if (this.jrTempNotOnTopHtcComplete(jobRequest)) {
      return true;
    }
    if (this.jrIsCriticalComplete(jobRequest)) {
      return true;
    }
    if (this.jrOnTopHtcComplete(jobRequest)) {
      return true;
    }
    return false;
  }

  private jrTempNotOnTopHtcComplete(jobRequest: Partial<JobRequest>): boolean {
    return jobRequest.activeWorkforce === JobRequestWorkerType.TEMP && !jobRequest.isCritical && !jobRequest.onTopHct && !!jobRequest.approvedSHRBPHOT1Q;
  }

  private jrOnTopHtcComplete(jobRequest: Partial<JobRequest>): boolean {
    return !!jobRequest.onTopHct && !!jobRequest.approvedEmploymentCommitee;
  }

  private jrIsCriticalComplete(jobRequest: Partial<JobRequest>): boolean {
    return !!jobRequest.isCritical && !jobRequest.onTopHct && !!jobRequest.approvedHOCOOHOHRCOO;
  }

  private jrAlreadyFilled(form: FormGroup<JobRequestForm>): boolean {
    const formValue = form.getRawValue();
    return !!formValue.candidate || formValue.status === JobRequestStatus.FILLED;
  }

  setFormValuesForEmployee(employee: Employee, form: WritableSignal<FormGroup<JobRequestForm>>) {
    form.update((form) => {
      form.controls['id'].setValue(null);
      form.controls['status'].setValue(null);
      form.controls['postingDate'].setValue(null);
      form.controls['type'].setValue(JobRequestType.REPLACEMENT);
      form.controls['type'].enable();
      form.controls['siglum'].setValue(employee.siglum?.id || null);
      form.controls['siglum'].enable();
      form.controls['description'].setValue(employee.job || null);
      form.controls['description'].enable();
      form.controls['workdayNumber'].setValue(null);
      form.controls['candidate'].setValue(null);
      form.controls['direct'].setValue(employee.direct || null);
      form.controls['direct'].enable();
      form.controls['activeWorkforce'].setValue(
        employee.activeWorkforce === JobRequestWorkerType.AWF || employee.activeWorkforce === JobRequestWorkerType.TEMP ? employee.activeWorkforce : null,
      );
      form.controls['activeWorkforce'].enable();
      form.controls['country'].setValue(employee.costCenter?.location?.country || null);
      form.controls['country'].enable();
      form.controls['site'].setValue(employee.costCenter?.location?.site || null);
      form.controls['site'].enable();
      form.controls['kapisCode'].setValue(employee.costCenter?.location?.kapisCode || null);
      form.controls['kapisCode'].enable();
      form.controls['collar'].setValue(employee.collar === JobRequestCollarType.WC || employee.collar === JobRequestCollarType.BC ? employee.collar : null);
      form.controls['collar'].enable();
      form.controls['onTopHct'].setValue(false);
      form.controls['onTopHct'].enable();
      form.controls['external'].setValue(false);
      form.controls['external'].disable();
      form.controls['earlyCareer'].setValue(null);
      form.controls['earlyCareer'].enable();
      form.controls['isCritical'].setValue(null);
      form.controls['isCritical'].enable();

      return form;
    });
  }
}
