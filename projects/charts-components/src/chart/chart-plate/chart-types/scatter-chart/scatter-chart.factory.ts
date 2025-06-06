import { IChartDataset } from '../models/i-chart-dataset';
import { ChartConstants } from '../../../models/chart-constants';
import { BubbleDataModel } from '../../../models/bubble-data.model';
import { ScatterChartSettings } from './scatter-chart.settings';
import { ChartDataModel } from '../../../models';

/**
 * ScatterChartFactory is a utility class responsible for creating scatter chart datasets
 * based on user-defined settings and input data.
 */
export class ScatterChartFactory {
  /**
   * Builds and returns a scatter chart dataset configuration based on the provided settings and data.
   *
   * @param {ScatterChartSettings} settings - The configuration settings for the scatter chart, including properties such as id, name, order, axes, and style.
   * @param {ChartDataModel[]} data - The data points to be included in the scatter chart dataset.
   * @return {IChartDataset<'scatter', ChartDataModel[]>} The configured scatter chart dataset.
   */
  public static build(
    settings: ScatterChartSettings,
    data: ChartDataModel[],
  ): IChartDataset<'scatter', ChartDataModel[]> {
    return {
      data: data,
      id: settings.id,
      label: settings.name,
      order: settings.order,
      type: 'scatter',
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      pointStyle: settings.pointStyle,
      backgroundColor: settings.color,
      pointRadius: settings.pointRadius,
      pointRotation: settings.pointRotation,
    } as IChartDataset<'scatter', BubbleDataModel[]>;
  }
}
