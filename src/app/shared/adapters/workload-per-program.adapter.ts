import { Injectable } from '@angular/core';
import { Adapter } from './adapter.interface';
import { WorkloadPerProgramAPI } from '../models/worksync.model';
import { LineDetailChartData } from '../models/graphs/line-detail-chart.model';
import * as numberUtils from '@src/utils/number-utils';

@Injectable({
  providedIn: 'root',
})
export class WorkloadPerProgramAdapter implements Adapter<WorkloadPerProgramAPI[], LineDetailChartData[]> {
  adapt(data: WorkloadPerProgramAPI[]): LineDetailChartData[] | [] {
    if (!data || data.length === 0) {
      return [];
    }

    const perProgramData: LineDetailChartData[] = data.map((item) => {
      return {
        name: item.programName,
        khours: numberUtils.roundToDecimalPlaces(item.programKHrsSum, 1),
        programs: numberUtils.roundToDecimalPlaces(item.programsCount, 1),
      };
    });
    return perProgramData;
  }
}
