// noinspection JSSuspiciousNameCombination
import { ChartConstants } from '../../../models/chart-constants';
import { ChartLineSettings } from '../line-chart/chart-line.settings';
import { ChartDataModel } from '../../../models';
import { IChartDataset } from '../models/i-chart-dataset';

export class ChartLineDatasetFactory {
  public static build(settings: ChartLineSettings, data: ChartDataModel[]): IChartDataset<'line', ChartDataModel[]> {
    return {
      backgroundColor: settings.color,
      borderColor: settings.color,
      data: data,
      id: settings.id,
      label: settings.name,
      order: settings.order,
      pointRadius: settings.pointRadius,
      type: 'line',
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
    } as IChartDataset<'line', ChartDataModel[]>;
  }
}
