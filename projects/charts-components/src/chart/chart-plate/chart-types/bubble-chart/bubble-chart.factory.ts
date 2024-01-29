import { IChartDataset } from '../models/i-chart-dataset';
import { ChartConstants } from '../../../models/chart-constants';
import { BubbleChartSettings } from './bubble-chart.settings';
import { BubbleDataModel } from '../../../models/bubble-data.model';

export class BubbleChartFactory {
  public static build(
    settings: BubbleChartSettings,
    data: BubbleDataModel[],
  ): IChartDataset<'bubble', BubbleDataModel[]> {
    return {
      backgroundColor: settings.color,
      borderColor: settings.borderColor,
      data: data,
      id: settings.id,
      label: settings.name,
      order: settings.order,
      type: 'bubble',
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
    } as IChartDataset<'bubble', BubbleDataModel[]>;
  }
}
