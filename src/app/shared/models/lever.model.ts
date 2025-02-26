import { Siglum } from '@models/siglum.model';
import { DIRECT_INDIRECT_VALUES, Employee } from '@models/employee.model';
import { CostCenter } from '@models/cost-center.model';

export interface Lever {
  id: number;
  leverType: string;
  highlights: string;
  startDate: string;
  endDate: string;
  fte: number;
  siglumDestination: Siglum;
  activeWorkforce: string;
  direct: DIRECT_INDIRECT_VALUES;
  employee?: Employee;
  costCenter?: CostCenter;
}

export enum LEVER_TYPES {
  LONG_TERM_SICKNESS = 'Long-term sickness',
  PARENTAL_LEAVE = 'Parental leave',
  MOBILITY_OUT = 'Mobility Out',
  RETIREMENT = 'Retirement',
  PRE_RETIREMENT = 'Pre-Retirement',
  SHIFT_CHANGE = 'Shift Change',
  TEMP_RELEASE = 'Temp release',
  TEMP_RENOVATION = 'Temp renovation',
  OTHER_ABSENCE = 'Other absence',
  BORROWED = 'Borrowed',
  LEASED = 'Leased',
  PERIMETER_CHANGE = 'Perimeter Change',
  REDEPLOYMENT = 'Redeployment',
  INTERNAL_MOBILITY = 'Internal mobility',
}

export const personalLeverTypes = [
  'Long-term sickness',
  'Parental leave',
  'Mobility Out',
  'Retirement',
  'Pre-Retirement',
  'Shift Change',
  'Temp release',
  'Temp renovation',
  'Other absence',
  'Borrowed',
  'Leased',
  'Internal mobility',
];

export const impersonalLeverTypes = ['Perimeter Change', 'Redeployment'];
