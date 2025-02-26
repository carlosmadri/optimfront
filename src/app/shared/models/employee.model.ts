import { Lever } from '@models/lever.model';
import { Siglum } from '@models/siglum.model';
import { CostCenter } from '@models/cost-center.model';

export enum DIRECT_INDIRECT_VALUES {
  DIRECT = 'Direct',
  INDIRECT = 'Indirect',
}

export enum DIRECT_INDIRECT_TYPES {
  DIRECT = 'direct',
}

export enum ACTIVE_WORKFORCE_TYPES {
  ACTIVE_WORKFORCE = 'activeWorkforce',
}

export const activeWorkforceValues = ['AWF', 'NAWF', 'TEMP'];

export const directIndirectValues = ['Direct', 'Indirect'];

export const availabilityReasonValues = [
  'Unlimited contract',
  'Dormant Contract Home',
  'Apprent, Student or insign. EE',
  'Part-time during parent. leave',
  'Longterm sickness absence',
  'Temporary/External/Pensioner',
  'Partial retirement inactive',
  'Parental leave absence',
  'Other absence leave',
  'Partial retirement active',
  'Limited contract > 3 months',
  'Maternity leave absence',
  'Work inability limited pension',
  'Secondment/Internat.assignment',
  'Longterm sickness absence Act.',
  'Trainee (France / Spain)',
];

export const contractTypeValues = ['Unlimited', 'Limited', 'Permanent'];

export interface DirectIndirect {
  direct: number;
  indirect: number;
}

export interface EmployeeSummaryNAWF {
  availabilityReason: string;
  employeeCount: number;
}

export interface Employee {
  id: number;
  employeeId: number;
  direct: DIRECT_INDIRECT_VALUES;
  job: string;
  collar: string;
  lastName: string;
  firstName: string;
  activeWorkforce: string;
  availabilityReason: string;
  contractType: string;
  siglum: Partial<Siglum>;
  costCenter: Partial<CostCenter>;
  levers: Lever[];
  jobRequest: string | null;
  fte: number;
  impersonal: boolean;
}

export interface EmployeeApiResponse {
  content: Employee[];
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
