import { FormControl } from '@angular/forms';
import { Siglum } from '@models/siglum.model';
import { Location } from '@models/location.model';
import { CostCenter } from './cost-center.model';
import { DIRECT_INDIRECT_VALUES } from './employee.model';

export interface JobRequestSummaryTypes {
  type: string;
  count: number;
}

export interface JobRequest {
  id: number;
  workdayNumber: string;
  type: JobRequestType;
  status: JobRequestStatus | null;
  description: string;
  candidate: string;
  startDate: string;
  releaseDate: string;
  postingDate: string;
  external: boolean;
  earlyCareer: boolean;
  onTopHct: boolean;
  isCritical: boolean;
  activeWorkforce: JobRequestWorkerType;
  approvedQMC: boolean;
  approvedSHRBPHOT1Q: boolean;
  approvedHOCOOHOHRCOO: boolean;
  approvedEmploymentCommitee: boolean;
  siglum: Siglum;
  location: Location;
  direct: DIRECT_INDIRECT_VALUES;
  kapisCode: string;
  costCenter: CostCenter;
  collar: JobRequestCollarType;
}

export interface JobRequestApiResponse {
  content: JobRequest[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: string;
  size: number;
  sort: { sorted: boolean; empty: boolean; unsorted: boolean };
  totalElements: number;
  totalPages: number;
}

export interface JobRequestForm {
  id: FormControl<number | null>;
  status: FormControl<JobRequestStatus | null>;
  postingDate: FormControl<string | null>;
  type: FormControl<JobRequestType | null>;
  siglum: FormControl<number | null>;
  description: FormControl<string | null>;
  workdayNumber: FormControl<string | null>;
  candidate: FormControl<string | null>;
  direct: FormControl<DIRECT_INDIRECT_VALUES | null>;
  activeWorkforce: FormControl<JobRequestWorkerType | null>;
  country: FormControl<string | null>;
  site: FormControl<string | null>;
  kapisCode: FormControl<string | null>;
  costCenter: FormControl<CostCenter | null>;
  collar: FormControl<JobRequestCollarType | null>;
  startDate: FormControl<string | null>;
  releaseDate?: FormControl<string | null>;
  onTopHct: FormControl<boolean | null>;
  external: FormControl<boolean | null>;
  earlyCareer: FormControl<boolean | null>;
  isCritical: FormControl<boolean | null>;
  approvedQMC: FormControl<boolean | null>;
  approvedSHRBPHOT1Q: FormControl<boolean | null>;
  approvedHOCOOHOHRCOO: FormControl<boolean | null>;
  approvedEmploymentCommitee: FormControl<boolean | null>;
}

export enum JobRequestStatus {
  ON_HOLD = 'On Hold',
  VALIDATION = 'Validation Required',
  QMC_APPROVED = 'QMC Approved',
  SHRBP_HO_T1Q_APPROVED = 'SHRBP/HO/T1Q Approved',
  COO_APPROVED = 'COO Approved',
  COMMITEE_APPROVED = 'Approved by Employment commitee',
  OPENED = 'Opened',
  FILLED = 'Filled',
}

export enum JobRequestType {
  CREATION = 'Creation',
  REPLACEMENT = 'Replacement',
  TEMPORARY_EXTENSION = 'Temporary Extension',
  CONVERSION = 'Conversion',
}

export enum JobRequestWorkerType {
  AWF = 'AWF',
  TEMP = 'TEMP',
}

export enum JobRequestCollarType {
  WC = 'WC',
  BC = 'BC',
}

export interface JobRequestApprovalState {
  approvedQMC: boolean;
  approvedSHRBPHOT1Q: boolean;
  approvedHOCOOHOHRCOO: boolean;
  approvedEmploymentCommitee: boolean;
}
