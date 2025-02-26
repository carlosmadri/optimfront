export interface ApiTeamOutlook {
  fteActives: number;
  fteNonActives: number;
  leavers: number;
  recoveries: number;
  redeployment: number;
  perimeterChanges: number;
  internalMobility: number;
  filled: number;
  opened: number;
  validationProcess: number;
  onHold: number;
  hcCeiling: number;
  optimisticView: number;
  validationView: number;
  realisticView: number;
  optimisticViewAverage: number;
  validationViewAverage: number;
  realisticViewAverage: number;
}

export interface TeamOutlook {
  fteTotalValue: number;
  fteNAWF: number;
  leaversSummary: { title: string; value: number }[];
  jrSummary: { title: string; value: number }[];
  eoySummary: { title: string; value: number; increase: boolean }[];
  avgSummary: { title: string; value: number }[];
  hcCeiling: number;
}
