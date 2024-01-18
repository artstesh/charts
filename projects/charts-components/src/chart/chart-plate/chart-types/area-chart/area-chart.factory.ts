import { ChartAreaDataModel } from '../../../models';
import { IChartDataset } from '../models/i-chart-dataset';
import { ChartConstants } from '../../../models/chart-constants';
import { AreaChartSettings } from './area-chart.settings';

export class AreaChartFactory {
  public static build(
    settings: AreaChartSettings,
    data: ChartAreaDataModel[],
    color: CanvasGradient | null,
  ): IChartDataset<any, ChartAreaDataModel[]> {
    return {
      id: settings.id,
      label: this.name,
      type: 'area',
      order: settings.order,
      data: data,
      tension: 0.6,
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      backgroundColor: color,
      pointRadius: 5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      hoverRadius: 0,
      pointStyle: false,
      borderColor: 'transparent',
      capBezierPoints: true,
    } as IChartDataset<any, ChartAreaDataModel[]>;
  }
}
