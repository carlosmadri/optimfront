import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestDialogComponent } from './job-request-dialog.component';
import { MockJobRequestDialogComponent } from '@src/app/mocks/components/workout-job-request-dialog-mock.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SiglumService } from '@src/app/services/siglum/siglum.service';
import { LocationService } from '@src/app/services/location/location.service';
import { signal } from '@angular/core';
import { AllSiglums, Siglum } from '@src/app/shared/models/siglum.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Location } from '@src/app/shared/models/location.model';
import { JobRequestService } from '@src/app/services/job-request/job-request.service';
import { JobRequest, JobRequestCollarType, JobRequestStatus, JobRequestType, JobRequestWorkerType } from '@src/app/shared/models/job-request.model';
import { DialogService } from '@src/app/services/dialog-service/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManageJobRequestService } from '@src/app/services/job-request/manage-job-request.service';
import { CostCenter } from '@src/app/shared/models/cost-center.model';
import { DIRECT_INDIRECT_VALUES } from '@src/app/shared/models/employee.model';

const mockLocations: Location[] = [
  {
    id: 1,
    country: 'Belgium',
    site: 'Diegem',
    kapisCode: '1000',
  } as Location,
  {
    id: 2,
    country: 'France',
    site: 'Elancourt',
    kapisCode: '2001',
  } as Location,
  {
    id: 2,
    country: 'France',
    site: 'Antibes',
    kapisCode: '2002',
  } as Location,
];

const mockJobRequestData: JobRequest = {
  id: 1,
  workdayNumber: '12345678',
  type: JobRequestType.CONVERSION,
  status: JobRequestStatus.OPENED,
  description: 'Test description',
  candidate: 'Test candidate',
  startDate: '2021-01-01',
  releaseDate: '2021-01-01',
  postingDate: '2021-01-01',
  external: false,
  earlyCareer: false,
  onTopHct: false,
  isCritical: false,
  activeWorkforce: JobRequestWorkerType.TEMP,
  approvedQMC: false,
  approvedSHRBPHOT1Q: false,
  approvedHOCOOHOHRCOO: false,
  approvedEmploymentCommitee: false,
  siglum: {
    id: 1,
  } as Siglum,
  location: mockLocations[0],
  direct: DIRECT_INDIRECT_VALUES.DIRECT,
  kapisCode: '1000',
  costCenter: {
    id: 1,
    costCenterCode: 'BE1000',
  } as CostCenter,
  collar: JobRequestCollarType.BC,
};

describe('JobRequestDialogComponent', () => {
  let component: JobRequestDialogComponent;
  let fixture: ComponentFixture<JobRequestDialogComponent>;
  const allLocations = signal<Location[]>(mockLocations);
  const allSiglums = signal<Siglum[]>([]);
  const allFormattedSiglums = signal<AllSiglums | null>(null);
  const mockSiglumService: Partial<SiglumService> = {
    allSiglums: allSiglums,
    allFormattedSiglums: allFormattedSiglums,
    getAllSiglums: jest.fn(),
    getSiglumFilterFields: jest.fn(),
  };

  const mockLocationService: Partial<LocationService> = {
    getSitesFilterValues: jest.fn(),
    getCountriesFilterValues: jest.fn(),
    getAllLocations: jest.fn(),
    allLocations,
  };

  let mockJobRequestService: Partial<JobRequestService>;
  let mockDialogService: Partial<DialogService>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(() => {
    const mockJobRequests = signal<JobRequest[]>([]);
    mockJobRequestService = {
      getTypesSummary: jest.fn().mockResolvedValue(undefined),
      createJobRequest: jest.fn().mockResolvedValue(undefined),
      updateJobRequest: jest.fn().mockResolvedValue(undefined),
      jobRequests: mockJobRequests,
    };

    mockDialogService = {
      openMessageDialog: jest.fn(),
    };
  });

  function createComponent(dialogData?: JobRequest) {
    TestBed.configureTestingModule({
      imports: [JobRequestDialogComponent, MockJobRequestDialogComponent, NoopAnimationsModule],
      providers: [
        ManageJobRequestService,
        provideNativeDateAdapter(),
        { provide: LocationService, useValue: mockLocationService },
        { provide: SiglumService, useValue: mockSiglumService },
        { provide: JobRequestService, useValue: mockJobRequestService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Create JR tests', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('Default form state', () => {
      it('should display the externalised field selected as No', () => {
        expect(component.form()!.controls['external'].disabled).toBeTruthy();
      });

      it('should not display the releaseDate field', () => {
        expect(component.form()!.controls['releaseDate']).toBeUndefined();
      });

      it('should display On Top of HC Target as No', () => {
        expect(component.form()!.controls['onTopHct'].value).toBe(false);
      });

      it('should display display the externalised field as disabled', () => {
        expect(component.form()!.controls['external'].disabled).toBeTruthy();
      });
    });

    //  Temporary disabled due to the error the pipeline is throwing
    xdescribe('On select WorkerType = TEMP', () => {
      beforeEach(() => {
        component.form()!.controls['activeWorkforce'].setValue(JobRequestWorkerType.TEMP);
        fixture.detectChanges();
      });
      it('should display the externalised field selected as Yes', () => {
        expect(component.form()!.controls['external'].value).toBe(true);
      });

      it('should display the earlyCareer field selected as Yes', () => {
        expect(component.form()!.controls['earlyCareer'].value).toBe(true);
      });

      it('should display the releaseDate field', () => {
        expect(component.form()!.controls['releaseDate']).not.toBeUndefined();
      });
    });

    describe('Select location', () => {
      it('should display an empty list of sites if there is no country selected', () => {
        component.form()!.controls['country'].setValue(null);

        fixture.detectChanges();

        expect(component.siteOptions().length).toBe(0);
      });

      it('should display the list of sites for a country when that country is selected', () => {
        component.form()!.controls['country'].setValue(mockLocations[1].country);

        fixture.detectChanges();

        expect(component.siteOptions().length).toBe(2);
      });

      it('should display the kapisCode of the selected site', () => {
        component.form()!.controls['country'].setValue(mockLocations[1].country);
        component.form()!.controls['site'].setValue(mockLocations[1].site);

        fixture.detectChanges();

        expect(component.form()!.controls['kapisCode'].value).toEqual(mockLocations[1].kapisCode);
      });

      // it('should display the Cost center code of the selected site', () => {
      //   component.form()!.controls['country'].setValue(mockLocations[1].country);
      //   component.form()!.controls['site'].setValue(mockLocations[1].site);
      //
      //   fixture.detectChanges();
      //
      //   expect(component.form()!.controls['costCenter'].value?.costCenterCode).toEqual(mockLocations[1].costCenter?.costCenterCode);
      // });

      it('should set the Country, Site and Cost center when an existing kapicode is typed', async () => {
        component.form()!.controls['kapisCode'].setValue(mockLocations[2].kapisCode);

        component.checkKapisCode();

        expect(component.form()!.controls['country'].value).toEqual(mockLocations[2].country);
        expect(component.form()!.controls['site'].value).toEqual(mockLocations[2].site);
        // expect(component.form()!.controls['costCenter'].value?.costCenterCode).toEqual(mockLocations[2].costCenter?.costCenterCode);

        component.form()!.controls['kapisCode'].setValue('');
        component.checkKapisCode();

        expect(component.form()!.controls['country'].value).toBeNull();
        expect(component.form()!.controls['site'].value).toBeNull();
        expect(component.form()!.controls['costCenter'].value).toBeNull();
      });
    });
  });

  describe('Edit JR tests', () => {
    describe('Enable Externalised field after JR is Open for 2 weeks', () => {
      const mockJobRequesEditData = {
        ...mockJobRequestData,
        postingDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
        status: JobRequestStatus.OPENED,
      };
      beforeEach(() => {
        createComponent(mockJobRequesEditData);
      });
      it('should display display the externalised field as enabled if the JR status is Open and the postingDate is previous to two weeks ago', () => {
        expect(component.form()!.controls['external'].disabled).toBeFalsy();
      });
    });

    describe('Disable JR information and JR Profile fields if the validation is in progress', () => {
      const mockJobRequesEditData = {
        ...mockJobRequestData,
        status: JobRequestStatus.VALIDATION,
      };
      beforeEach(() => {
        createComponent(mockJobRequesEditData);
      });
      it('should display display the externalised field as enabled if the JR status is Open and the postingDate is previous to two weeks ago', () => {
        expect(component.form()!.controls['type'].disabled).toBeTruthy();
        expect(component.form()!.controls['startDate'].disabled).toBeTruthy();
        expect(component.form()!.controls['onTopHct'].disabled).toBeTruthy();
      });
    });

    describe('Set the JR to status OPENED on the right step', () => {
      const mockJobRequesEditData = {
        ...mockJobRequestData,
        status: JobRequestStatus.VALIDATION,
        candidate: '',
      };
      beforeEach(() => {
        createComponent(mockJobRequesEditData);
      });
      it('should set the JR as Opened when the user save the form with status SHRBP/HO/T1Q Approved for TEMP activeWorkforce and no onTopHct', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.TEMP);
          form!.controls['onTopHct'].setValue(false);
          form!.controls['isCritical'].setValue(false);
          form!.controls['status'].setValue(JobRequestStatus.SHRBP_HO_T1Q_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.OPENED }), '1');
      });

      it('should set the JR as SHRBP/HO/T1Q Approved when the user save the form with status SHRBP/HO/T1Q Approved for TEMP activeWorkforce and is onTopHct', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.TEMP);
          form!.controls['onTopHct'].setValue(true);
          form!.controls['isCritical'].setValue(false);
          form!.controls['status'].setValue(JobRequestStatus.SHRBP_HO_T1Q_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.SHRBP_HO_T1Q_APPROVED }), '1');
      });

      it('should set the JR as SHRBP/HO/T1Q Approved when the user save the form with status SHRBP/HO/T1Q Approved for TEMP activeWorkforce and isCritical', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.TEMP);
          form!.controls['onTopHct'].setValue(false);
          form!.controls['isCritical'].setValue(true);
          form!.controls['status'].setValue(JobRequestStatus.SHRBP_HO_T1Q_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.SHRBP_HO_T1Q_APPROVED }), '1');
      });

      it('should set the JR as Opened when the user save the form with status Approved by Employment commitee for TEMP when the JR is onTopHct', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['approvedHOCOOHOHRCOO'].setValue(true);
          form!.controls['approvedEmploymentCommitee'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.TEMP);
          form!.controls['onTopHct'].setValue(true);
          form!.controls['isCritical'].setValue(false);
          form!.controls['status'].setValue(JobRequestStatus.COMMITEE_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.OPENED }), '1');
      });

      it('should set the JR AWF as Opened when saving it with status Approved by the HO COO/HO HR COO when the JR is Critical', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['approvedHOCOOHOHRCOO'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.AWF);
          form!.controls['onTopHct'].setValue(false);
          form!.controls['isCritical'].setValue(true);
          form!.controls['status'].setValue(JobRequestStatus.COO_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.OPENED }), '1');
      });

      it('should set the JR AWF as Opened when saving it with status Approved by the Employment Committee when the JR is not Critical', () => {
        component.form.update((form) => {
          form!.controls['approvedQMC'].setValue(true);
          form!.controls['approvedSHRBPHOT1Q'].setValue(true);
          form!.controls['approvedHOCOOHOHRCOO'].setValue(true);
          form!.controls['approvedEmploymentCommitee'].setValue(true);
          form!.controls['activeWorkforce'].setValue(JobRequestWorkerType.AWF);
          form!.controls['onTopHct'].setValue(false);
          form!.controls['isCritical'].setValue(false);
          form!.controls['status'].setValue(JobRequestStatus.COMMITEE_APPROVED);
          return form;
        });
        const updateSpy = jest.spyOn(mockJobRequestService, 'updateJobRequest');

        component.save();

        expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ status: JobRequestStatus.OPENED }), '1');
      });
    });
  });
});
