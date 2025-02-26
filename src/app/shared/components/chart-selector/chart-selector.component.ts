import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChartSelectorService } from '@src/app/services/chart-selector/chart-selector.service';
import { CHART_SELECTORS_DATA, ChartIds } from '../../models/worksync.model';

@Component({
  selector: 'optim-chart-selector',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './chart-selector.component.html',
  styleUrl: './chart-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartSelectorComponent {
  private readonly chartSelectorService = inject(ChartSelectorService);
  private readonly formBuilder = inject(FormBuilder);

  workloadChecks = this.chartSelectorService.workloadChecks;

  selectorType = input<'monthly' | 'worksync' | undefined>();

  lineLabels = CHART_SELECTORS_DATA.map((data) => data.label);
  lineNames = CHART_SELECTORS_DATA.map((data) => data.name);

  workForceIds = [ChartIds.REALISTIC, ChartIds.VALIDATION, ChartIds.OPTIMISTIC];

  workforceChecks = new Set(this.getIndexOfCheckSelectors(this.workForceIds));

  readonly formGraphChecks = this.formBuilder.group(
    this.lineNames.reduce(
      (acc, name) => {
        acc[name] = true;
        return acc;
      },
      {} as Record<ChartIds, boolean>,
    ),
  );

  formChanges = toSignal(this.formGraphChecks.valueChanges);

  constructor() {
    effect(
      () => {
        let formValues = this.formChanges();
        if (!formValues) {
          formValues = this.formGraphChecks.value;
        }
        const selectedChecks = this.getSelectedChecks(Object.entries(formValues) as [ChartIds, boolean | null | undefined][]);
        const workloadChecks = this.workloadChecks();
        const allAvailableChecks = [...this.workForceIds, ...workloadChecks];
        const existingWorkloadChecks = selectedChecks.filter((check) => allAvailableChecks.includes(check));
        this.chartSelectorService.setSelectedChecks(existingWorkloadChecks);
      },
      { allowSignalWrites: true },
    );
  }

  workloadChecksIndex = computed<Set<number> | undefined>(() => {
    return new Set(this.getIndexOfCheckSelectors(this.workloadChecks()));
  });

  getSelectedChecks(formValues: [ChartIds, boolean | null | undefined][]): ChartIds[] {
    return formValues.filter(([, value]) => value).map(([key]) => key);
  }

  getIndexOfCheckSelectors(chars: ChartIds[]): number[] {
    return CHART_SELECTORS_DATA.reduce((acc, data, index) => {
      if (chars.includes(data.name)) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
  }
}
