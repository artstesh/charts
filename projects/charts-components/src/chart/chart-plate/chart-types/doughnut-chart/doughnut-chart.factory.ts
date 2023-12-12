import { Injectable } from '@angular/core';
import { RadialDataModel } from '../../../models';
import { IChartDataset } from '../models/i-chart-dataset';
import { DoughnutChartSettings } from './doughnut-chart.settings';

@Injectable({ providedIn: 'root' })
export class DoughnutChartFactory {
  public build(settings: DoughnutChartSettings, data: RadialDataModel[]): IChartDataset<'doughnut', number[]> {
    const colors: string[] = [];
    const values: number[] = [];
    data.forEach((d) => {
      colors.push(d.color);
      values.push(d.x);
    });
    return {
      backgroundColor: colors,
      data: values,
      id: settings.id,
      label: settings.name,
      type: 'doughnut',
    } as IChartDataset<'doughnut', number[]>;
  }
}
