import { inject, Injectable } from '@angular/core';
import { Adapter } from '../adapter.interface';
import { ChartColors, ChartIds, WorkloadWorkforce, WorkloadWorkforceAPI } from '../../models/worksync.model';
import * as numberUtils from '@src/utils/number-utils';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';

@Injectable({
  providedIn: 'root',
})
export class WorkloadWorkforceAdapter implements Adapter<WorkloadWorkforceAPI, WorkloadWorkforce[]> {
  chartSelectorService = inject(ChartSelectorService);

  adapt(data: WorkloadWorkforceAPI): WorkloadWorkforce[] {
    if (!data) {
      return [];
    }

    const workloadData: WorkloadWorkforce[] = [
      {
        id: ChartIds.OP,
        label: 'OP',
        value: numberUtils.roundToDecimalPlaces(data.exerciseOP, 1),
        color: ChartColors.OP,
      },
      {
        id: ChartIds.FCII,
        label: 'FCII',
        value: numberUtils.roundToDecimalPlaces(data.exerciseFCII, 1),
        color: ChartColors.FCII,
      },
    ];

    if (data.exerciseBU != null) {
      workloadData.push({
        id: ChartIds.WIP,
        label: 'WIP',
        value: numberUtils.roundToDecimalPlaces(data.exerciseBU, 1),
        color: ChartColors.WIP,
      });
    }

    if (data.exerciseQMC != null) {
      workloadData.push({
        id: ChartIds.QMC,
        label: 'QMC',
        value: numberUtils.roundToDecimalPlaces(data.exerciseQMC, 1),
        color: ChartColors.QMC,
      });
    }

    if (data.exerciseT1Q != null) {
      workloadData.push({
        id: ChartIds.HOT1Q,
        label: 'HOT1Q',
        value: numberUtils.roundToDecimalPlaces(data.exerciseT1Q, 1),
        color: ChartColors.HOQ1T,
      });
    }

    const workforceData: WorkloadWorkforce[] = [
      {
        id: ChartIds.OPTIMISTIC,
        label: 'Optimistic',
        value: numberUtils.roundToDecimalPlaces(data.optimisticView, 1),
        color: ChartColors.OPTIMISTIC,
      },
      {
        id: ChartIds.VALIDATION,
        label: 'Validation',
        value: numberUtils.roundToDecimalPlaces(data.validationView, 1),
        color: ChartColors.VALIDATION,
      },
      {
        id: ChartIds.REALISTIC,
        label: 'Realistic',
        value: numberUtils.roundToDecimalPlaces(data.realisticView, 1),
        color: ChartColors.REALISTIC,
      },
      {
        id: ChartIds.HC_CEILING,
        label: 'HC Ceiling',
        value: numberUtils.roundToDecimalPlaces(data.hcCeiling, 1),
        color: ChartColors.HC_CEILING,
      },
    ];
    return [...workloadData, ...workforceData];
  }

  filterWorkloadWorkforceLines(workloadWorkforceData: WorkloadWorkforce[], checkedLines: string[]): WorkloadWorkforce[] {
    const defaultCheckedLines = ['hcCeiling'];
    const acceptedLines = [...defaultCheckedLines, ...checkedLines];
    return workloadWorkforceData.filter((workloadWorkforce) => acceptedLines.includes(workloadWorkforce.id));
  }
}
