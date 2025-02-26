import { Injectable, signal } from '@angular/core';
import { ChartIds } from '@src/app/shared/models/worksync.model';

@Injectable({
  providedIn: 'root',
})
export class ChartSelectorService {
  private readonly conversionMap = new Map<string, ChartIds>([
    ['OP', ChartIds.OP],
    ['FCII', ChartIds.FCII],
    ['BU', ChartIds.WIP],
    ['First Submission', ChartIds.FIRST_SUBMISSION],
  ]);

  #workloadChecks = signal<ChartIds[]>([]);
  workloadChecks = this.#workloadChecks.asReadonly();

  #selectedChecks = signal<ChartIds[]>([]);
  selectedChecks = this.#selectedChecks.asReadonly();

  setSelectedChecks(selectedChecks: ChartIds[]): void {
    this.#selectedChecks.set(selectedChecks);
  }

  setWorkloadChecks(checks: ChartIds[]): void {
    const workloadChecks = checks.filter((check) => check !== ChartIds.OPTIMISTIC && check !== ChartIds.VALIDATION && check !== ChartIds.REALISTIC);
    this.#workloadChecks.set(workloadChecks);
  }

  toChecksFormat(value: string): string {
    return this.conversionMap.get(value) || value;
  }

  toExerciseNameFormat(value: ChartIds): string {
    for (const [key, val] of this.conversionMap.entries()) {
      if (val === value) {
        return key;
      }
    }
    return value;
  }
}
