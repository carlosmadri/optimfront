import { Siglum } from '@models/siglum.model';
import { CostCenter } from '@models/cost-center.model';

export interface WorksyncOwnSub {
  own: number;
  sub: number;
}

export interface WorkloadPerProgramAPI {
  programName: string;
  programKHrsSum: number;
  programsCount: number;
}

export enum WorkloadEvolutionStatusAPI {
  APPROVED = 'APPROVED',
  OPENED = 'OPENED',
  SUBMIT = 'SUBMIT',
  REJECTED = 'REJECTED',
}

export interface WorkloadEvolutionListAPI {
  exercise: string;
  khrsOwnDirect: number;
  khrsOwnIndirect: number;
  khrsSubDirect: number;
  khrsSubIndirect: number;
}

export interface WorkloadEvolutionAPI {
  workloadEvolutionList: WorkloadEvolutionListAPI[];
  lastStatus: WorkloadEvolutionStatusAPI;
  multipleSiglums: boolean;
}

export enum WorkloadEvolutionBarType {
  OP = 'OP',
  FCII = 'FCII',
  WIP = 'WIP',
  FIRST_SUBMISSION = 'First Submission',
  SUBMIT = 'SUBMIT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  MULTIPLE = 'MULTIPLE',
}

export interface WorkloadEvolution {
  data: WorkloadEvolutionBarData[];
  multipleSiglums: boolean;
  submissionStatus: WorkloadSubmissionStatus;
  validationStatus: WorkloadValidationStatus | undefined;
}
export interface WorkloadEvolutionBarData {
  exercise: string;
  id: ChartIds;
  barType: WorkloadEvolutionBarType;
  ownDirect: number;
  ownIndirect: number;
  subDirect: number;
  subIndirect: number;
  total: number;
}

export enum WorkloadSubmissionStatus {
  SUBMITTED = 'Submitted',
  NOT_SUBMITTED = 'Not Submitted',
  MULTIPLE = 'Multiple siglums',
}

export enum WorkloadValidationStatus {
  PENDING = 'Pending',
  VALIDATED = 'Validated',
  CHALLENGED = 'Challenged',
}

export interface WorkloadWorkforceAPI {
  exerciseOP: number;
  exerciseFCII: number;
  exerciseBU?: number;
  exerciseFirstSubmission?: number;
  exerciseQMC?: number;
  exerciseT1Q?: number;
  optimisticView: number;
  validationView: number;
  realisticView: number;
  hcCeiling: number;
}

export interface WorkloadWorkforce {
  id: ChartIds;
  label: string;
  value: number;
  color: ChartColors;
}

export enum ChartColors {
  OP = '#76b7b2',
  FCII = '#59a14f',
  WIP = '#edc949',
  FIRST_SUBMISSION = '#7dcf48',
  QMC = '#FF6B6B',
  HOQ1T = '#4e79a7',
  OPTIMISTIC = '#038387',
  VALIDATION = '#f28e2c',
  REALISTIC = '#e15759',
  HC_CEILING = '#ffff00',
  REJECTED = '#D6490B',
  ACCEPTED = '#4CAF50',
  PENDING = '#DFA800',
}

export enum ChartIds {
  OP = 'op',
  FCII = 'fcII',
  WIP = 'WIP',
  FIRST_SUBMISSION = 'firstSubmission',
  QMC = 'QMC',
  HOT1Q = 'HOT1Q',
  OPTIMISTIC = 'optimistic',
  VALIDATION = 'validation',
  REALISTIC = 'realistic',
  HC_CEILING = 'hcCeiling',
}

export interface ChartSelectorData {
  label: string;
  showAvg: boolean;
  name: ChartIds;
  color: ChartColors;
}

export const CHART_SELECTORS_DATA: readonly Readonly<ChartSelectorData>[] = [
  { label: 'Optimistic', showAvg: true, name: ChartIds.OPTIMISTIC, color: ChartColors.OPTIMISTIC },
  { label: 'Validation', showAvg: true, name: ChartIds.VALIDATION, color: ChartColors.VALIDATION },
  { label: 'Realistic', showAvg: true, name: ChartIds.REALISTIC, color: ChartColors.REALISTIC },
  { label: 'OP', showAvg: false, name: ChartIds.OP, color: ChartColors.OP },
  { label: 'FCII', showAvg: false, name: ChartIds.FCII, color: ChartColors.FCII },
  { label: 'WIP', showAvg: false, name: ChartIds.WIP, color: ChartColors.WIP },
  { label: 'First Submission', showAvg: false, name: ChartIds.FIRST_SUBMISSION, color: ChartColors.FIRST_SUBMISSION },
  { label: 'QMC', showAvg: false, name: ChartIds.QMC, color: ChartColors.PENDING },
  { label: 'HOT1Q', showAvg: false, name: ChartIds.HOT1Q, color: ChartColors.PENDING },
];

export interface WorkloadPreview {
  exercise: string;
  previsionkHrs: number;
  previsionFte: number;
  fte: number;
  khrs: number;
}

export const ownSubValues = ['OWN', 'SUB'];

export const coreNonCoreValues = ['Core', 'Non Core'];

export const collarValues = ['WC', 'BC'];

export const backlogOrderIntakeValues = ['Backlog', 'Order Intake'];

export interface Ppsid {
  id: number;
  ppsid: string;
  ppsidName: string;
  muCode: string;
  muText: string;
  businessLine: string;
  programLine: string;
  productionCenter: string;
  businessActivity: string;
  backlogOrderIntake: string;
  workload: string;
}

export interface Workload {
  id: number;
  direct: string;
  collar: string;
  own: string;
  core: null;
  scenario: string;
  go: boolean;
  description: string;
  exercise: string;
  startDate: string;
  endDate: string;
  siglum: Siglum;
  costCenter: CostCenter;
  ppsid: Ppsid;
  fte: number;
  khrs: number;
  keur: number;
  eac: boolean;
}

export interface WorkloadsApiResponse {
  content: Workload[];
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
