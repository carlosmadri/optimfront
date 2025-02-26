import { inject, Injectable } from '@angular/core';
import { Adapter } from '../adapter.interface';
import {
  ChartIds,
  WorkloadEvolution,
  WorkloadEvolutionAPI,
  WorkloadEvolutionBarData,
  WorkloadEvolutionBarType,
  WorkloadEvolutionListAPI,
  WorkloadEvolutionStatusAPI,
  WorkloadSubmissionStatus,
  WorkloadValidationStatus,
} from '../../models/worksync.model';
import * as numberUtils from '@src/utils/number-utils';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';

@Injectable({
  providedIn: 'root',
})
export class WorkloadEvolutionAdapter implements Adapter<WorkloadEvolutionAPI, WorkloadEvolution | null> {
  chartSelectorService = inject(ChartSelectorService);

  OpPattern = /^OP\d+$/;

  adapt(data: WorkloadEvolutionAPI | null): WorkloadEvolution | null {
    if (!data || !data.workloadEvolutionList || data.workloadEvolutionList.length === 0) {
      return null;
    }

    const chartData: WorkloadEvolutionBarData[] = data.workloadEvolutionList.map((item) => {
      return {
        exercise: item.exercise,
        id: this.getIdFromExerciseName(item.exercise),
        barType: data.multipleSiglums
          ? this.setMultipleBarType(data.lastStatus)
          : this.setIndividualBarType(data.lastStatus, item.exercise, data.workloadEvolutionList),
        ownDirect: numberUtils.roundToDecimalPlaces(item.khrsOwnDirect, 1),
        ownIndirect: numberUtils.roundToDecimalPlaces(item.khrsOwnIndirect, 1),
        subDirect: numberUtils.roundToDecimalPlaces(item.khrsSubDirect, 1),
        subIndirect: numberUtils.roundToDecimalPlaces(item.khrsSubIndirect, 1),
        total: numberUtils.roundToDecimalPlaces(item.khrsOwnDirect + item.khrsOwnIndirect + item.khrsSubDirect + item.khrsSubIndirect, 1),
      };
    });

    const submissionStatus = this.submissionStatus(data);
    const validationStatus = this.validationStatus(data);

    const evolutionData: WorkloadEvolution = {
      data: chartData,
      multipleSiglums: data.multipleSiglums,
      submissionStatus: submissionStatus,
      validationStatus: validationStatus,
    };

    return evolutionData;
  }

  private setIndividualBarType(
    status: WorkloadEvolutionStatusAPI,
    exercise: string,
    workLoadEvolutionList: WorkloadEvolutionListAPI[],
  ): WorkloadEvolutionBarType {
    if (this.isOpExercise(exercise)) {
      return WorkloadEvolutionBarType.OP;
    } else if (exercise === 'FCII') {
      return WorkloadEvolutionBarType.FCII;
    } else if (!this.isLastStep(exercise, workLoadEvolutionList)) {
      return WorkloadEvolutionBarType.APPROVED;
    } else if (status === WorkloadEvolutionStatusAPI.REJECTED) {
      return WorkloadEvolutionBarType.REJECTED;
    } else if (status === WorkloadEvolutionStatusAPI.APPROVED) {
      return WorkloadEvolutionBarType.APPROVED;
    } else if (status === WorkloadEvolutionStatusAPI.OPENED) {
      return WorkloadEvolutionBarType.WIP;
    } else {
      return WorkloadEvolutionBarType.SUBMIT;
    }
  }

  private setMultipleBarType(status: WorkloadEvolutionStatusAPI): WorkloadEvolutionBarType {
    if (status === WorkloadEvolutionStatusAPI.REJECTED) {
      return WorkloadEvolutionBarType.REJECTED;
    } else if (status === WorkloadEvolutionStatusAPI.APPROVED) {
      return WorkloadEvolutionBarType.APPROVED;
    } else {
      return WorkloadEvolutionBarType.MULTIPLE;
    }
  }

  private submissionStatus(data: WorkloadEvolutionAPI): WorkloadSubmissionStatus {
    const hasFirstSubmission = data.workloadEvolutionList.some((value) => value.exercise === 'First Submission');
    if (hasFirstSubmission && data.lastStatus !== WorkloadEvolutionStatusAPI.REJECTED) {
      return WorkloadSubmissionStatus.SUBMITTED;
    }
    return WorkloadSubmissionStatus.NOT_SUBMITTED;
  }

  private validationStatus(data: WorkloadEvolutionAPI): WorkloadValidationStatus | undefined {
    const hasFirstSubmission = data.workloadEvolutionList.some((value) => value.exercise === 'First Submission');
    const wipAsLastExercise = data.workloadEvolutionList[0].exercise === 'WIP';
    if (hasFirstSubmission && data.lastStatus === WorkloadEvolutionStatusAPI.REJECTED) {
      return WorkloadValidationStatus.CHALLENGED;
    } else if (hasFirstSubmission && !wipAsLastExercise && data.lastStatus === WorkloadEvolutionStatusAPI.APPROVED) {
      return WorkloadValidationStatus.VALIDATED;
    } else if (hasFirstSubmission && data.lastStatus === WorkloadEvolutionStatusAPI.SUBMIT) {
      return WorkloadValidationStatus.PENDING;
    }
    return;
  }

  private getIdFromExerciseName(exercise: string): ChartIds {
    if (this.isOpExercise(exercise)) {
      return ChartIds.OP;
    } else if (exercise === 'FCII') {
      return ChartIds.FCII;
    } else if (exercise === 'First Submission') {
      return ChartIds.FIRST_SUBMISSION;
    } else if (exercise === 'QMC') {
      return ChartIds.QMC;
    } else if (exercise === 'HOT1Q') {
      return ChartIds.HOT1Q;
    }
    return ChartIds.WIP;
  }

  filterWorkloadEvolutionLines(data: WorkloadEvolutionBarData[], checksList: ChartIds[]): WorkloadEvolutionBarData[] {
    const selectedChecks = checksList.map((name) => this.chartSelectorService.toExerciseNameFormat(name));

    const exerciseNames = data.map((value) => value.exercise);
    const exerciseNamesWithOP = this.setValueForOP(exerciseNames);

    const result = data.filter((value, index) => selectedChecks.includes(exerciseNamesWithOP[index]));
    return result;
  }

  private setValueForOP(exerciseNames: string[]): string[] {
    return exerciseNames.map((name) => (this.isOpExercise(name) ? ChartIds.OP.toUpperCase() : name));
  }

  private isOpExercise(exercise: string): boolean {
    return this.OpPattern.test(exercise);
  }

  private isLastStep(exercise: string, workLoadEvolutionList: WorkloadEvolutionListAPI[]): boolean {
    const exercisesList = workLoadEvolutionList.map((value) => value.exercise);
    if (exercise === ChartIds.HOT1Q) {
      return true;
    }
    if (exercise === ChartIds.QMC && exercisesList.includes(ChartIds.HOT1Q)) {
      return false;
    }
    if (exercise === 'BU' && (exercisesList.includes('First Submission') || exercisesList.includes('First Submition'))) {
      return false;
    }
    if (exercise === 'First Submission' && exercisesList.includes(ChartIds.QMC)) {
      return false;
    }
    return true;
  }
}
