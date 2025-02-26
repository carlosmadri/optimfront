import { Injectable } from '@angular/core';
import { WorkloadEvolutionBarType } from '@src/app/shared/models/worksync.model';

@Injectable()
export class ExerciseColorService {
  getColorMap(barTypes: WorkloadEvolutionBarType[], exerciseNames: string[]): Map<string, string> {
    const colorMap = new Map<string, string>();

    barTypes.forEach((barType, index) => {
      colorMap.set(exerciseNames[index], this.getColor(barType));
    });

    return colorMap;
  }

  private getColor(barType: string): string {
    if (barType === WorkloadEvolutionBarType.OP) {
      return '#5F5F5F';
    }
    if (barType === WorkloadEvolutionBarType.FCII) {
      return '#7F7F7F';
    }
    if (barType === WorkloadEvolutionBarType.REJECTED) {
      return '#f5584c';
    }
    if (barType === WorkloadEvolutionBarType.APPROVED) {
      return '#4caf50';
    }
    if (barType === WorkloadEvolutionBarType.SUBMIT) {
      return '#d8a200';
    }
    if (barType === WorkloadEvolutionBarType.WIP) {
      return '#bebebe';
    }
    if (barType === WorkloadEvolutionBarType.MULTIPLE) {
      return '#aaaaaa';
    }
    return '#000000';
  }
}
