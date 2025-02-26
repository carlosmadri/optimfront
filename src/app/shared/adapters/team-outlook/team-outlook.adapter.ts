import { Injectable } from '@angular/core';
import { Adapter } from '../adapter.interface';
import { ApiTeamOutlook, TeamOutlook } from '../../models/team-outlook.model';
import * as numberUtils from '@src/utils/number-utils';

@Injectable({
  providedIn: 'root',
})
export class TeamOutlookAdapter implements Adapter<ApiTeamOutlook, TeamOutlook> {
  adapt(apiData: ApiTeamOutlook): TeamOutlook {
    return {
      fteTotalValue: numberUtils.roundToDecimalPlaces(apiData.fteActives, 1),
      fteNAWF: numberUtils.roundToDecimalPlaces(apiData.fteNonActives, 1),
      leaversSummary: [
        {
          title: 'Leavers',
          value: numberUtils.roundToDecimalPlaces(apiData.leavers, 1),
        },
        {
          title: 'Recoveries',
          value: numberUtils.roundToDecimalPlaces(apiData.recoveries, 1),
        },
        {
          title: 'Redeployments',
          value: numberUtils.roundToDecimalPlaces(apiData.redeployment, 1),
        },
        {
          title: 'Perim. Changes',
          value: numberUtils.roundToDecimalPlaces(apiData.perimeterChanges, 1),
        },
        {
          title: 'Internal mobility',
          value: numberUtils.roundToDecimalPlaces(apiData.internalMobility, 1),
        },
      ],
      jrSummary: [
        {
          title: 'Filled',
          value: numberUtils.roundToDecimalPlaces(apiData.filled, 1),
        },
        {
          title: 'Opened',
          value: numberUtils.roundToDecimalPlaces(apiData.opened, 1),
        },
        {
          title: 'Validation Process',
          value: numberUtils.roundToDecimalPlaces(apiData.validationProcess, 1),
        },
        {
          title: 'On Hold',
          value: numberUtils.roundToDecimalPlaces(apiData.onHold, 1),
        },
      ],
      eoySummary: [
        {
          title: 'Realistic',
          value: numberUtils.roundToDecimalPlaces(apiData.realisticView, 1),
          increase: apiData.hcCeiling < apiData.realisticView,
        },
        {
          title: 'Validation required',
          value: numberUtils.roundToDecimalPlaces(apiData.validationView, 1),
          increase: apiData.hcCeiling < apiData.validationView,
        },
        {
          title: 'Optimistic view',
          value: numberUtils.roundToDecimalPlaces(apiData.optimisticView, 1),
          increase: apiData.hcCeiling < apiData.optimisticView,
        },
      ],
      avgSummary: [
        {
          title: 'Optimistic view',
          value: numberUtils.roundToDecimalPlaces(apiData.optimisticViewAverage, 1),
        },
        {
          title: 'Validation required',
          value: numberUtils.roundToDecimalPlaces(apiData.validationViewAverage, 1),
        },
        {
          title: 'Realistic',
          value: numberUtils.roundToDecimalPlaces(apiData.realisticViewAverage, 1),
        },
      ],
      hcCeiling: apiData.hcCeiling,
    };
  }
}
