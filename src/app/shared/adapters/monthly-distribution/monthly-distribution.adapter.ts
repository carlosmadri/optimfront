import { Injectable } from '@angular/core';
import { LineChartData, MONTHS_LIST } from '../../models/graphs/line-chart.model';
import { MONTHLY_CHART_DATA, MonthlyDistributionAPI } from '../../models/monthly-distribution.model';
import { Adapter } from '../adapter.interface';
import { ChartIds, ChartSelectorData } from '../../models/worksync.model';

@Injectable({
  providedIn: 'root',
})
export class MonthlyDistributionAdapter implements Adapter<MonthlyDistributionAPI, LineChartData> {
  adapt(data: MonthlyDistributionAPI): LineChartData | null {
    if (!data) {
      return null;
    }

    const hasFirstSubmission = data.firstSubmission != null;
    const hasWIP = data.bottomUp != null;

    const monthlyData = this.getMonthlyChartWithData(MONTHLY_CHART_DATA, hasFirstSubmission, hasWIP);
    const monthlyLabels = this.getMonthlyLabels(data);
    const monthlyValues = this.getMonthlyValues(data);
    const monthlyLineIds = this.getMonthlyLineIds(data);

    const chartData: LineChartData = {
      month: [...MONTHS_LIST, 'EoY'],
      labels: monthlyLabels,
      ids: monthlyLineIds,
      colors: monthlyData.map((data) => data.color),
      showAvg: monthlyData.map((data) => data.showAvg), // Show average line for Optimistic, RC, Realistic
      specificPoint: data.hcCeiling,
      specificPointColor: '#ffff00',
      specificPointLabel: 'HC Baseline',
      values: monthlyValues,
    };
    return chartData;
  }

  filterMonthlyDistributionLines(data: LineChartData, selectedChecks: ChartIds[]): LineChartData {
    const filteredData: Partial<LineChartData> = data.ids!.reduce(
      (acc, value, index) => {
        if (selectedChecks.includes(value)) {
          acc.labels!.push(data.labels![index]);
          acc.ids!.push(value);
          acc.colors!.push(data.colors![index]);
          acc.showAvg!.push(data.showAvg![index]);
          acc.values!.push(data.values![index]);
        }
        return acc;
      },
      { labels: [], ids: [], colors: [], showAvg: [], values: [] } as Partial<LineChartData>,
    );

    const result: LineChartData = {
      ...data,
      ...filteredData,
    };
    return result;
  }

  private getMonthlyChartWithData(data: ChartSelectorData[], hasFirstSubmission: boolean, hasWIP: boolean) {
    const chartData: ChartSelectorData[] = data.filter((data) => {
      if (data.name === ChartIds.WIP) {
        return hasWIP;
      }
      if (data.name === ChartIds.FIRST_SUBMISSION) {
        return hasFirstSubmission;
      }
      return true;
    });
    return chartData;
  }

  private getMonthlyLabels(data: MonthlyDistributionAPI) {
    const labels: string[] = MONTHLY_CHART_DATA.filter((data) => data.name !== ChartIds.WIP && data.name !== ChartIds.FIRST_SUBMISSION).map(
      (data) => data.label,
    );
    if (data.bottomUp != null) {
      labels.push(data.wipValue || 'WIP');
    }
    if (data.firstSubmission != null) {
      labels.push('First Sub.');
    }
    return labels;
  }

  private getMonthlyValues(data: MonthlyDistributionAPI) {
    const values: number[][] = [data.optimisticView, data.validationView, data.realisticView, data.op, data.fcii];
    if (data.firstSubmission != undefined) {
      values.push(data.firstSubmission);
    }
    if (data.bottomUp != undefined) {
      values.push(data.bottomUp);
    }
    return values;
  }

  private getMonthlyLineIds(data: MonthlyDistributionAPI): ChartIds[] {
    const names: ChartIds[] = [ChartIds.OPTIMISTIC, ChartIds.VALIDATION, ChartIds.REALISTIC, ChartIds.OP, ChartIds.FCII];
    if (data.bottomUp != null) {
      if (!!data.wipValue && data.wipValue !== 'WIP') {
        const wipValueId = this.getWipValueId(data.wipValue);
        names.push(wipValueId);
      } else {
        names.push(ChartIds.WIP);
      }
    }
    if (data.firstSubmission != null) {
      names.push(ChartIds.FIRST_SUBMISSION);
    }
    return names;
  }

  private getWipValueId(wipValue: string): ChartIds {
    if (wipValue === 'First Submission') {
      return ChartIds.FIRST_SUBMISSION;
    } else if (wipValue === 'QMC') {
      return ChartIds.QMC;
    } else if (wipValue === 'HOT1Q') {
      return ChartIds.HOT1Q;
    } else {
      return ChartIds.WIP;
    }
  }
}
