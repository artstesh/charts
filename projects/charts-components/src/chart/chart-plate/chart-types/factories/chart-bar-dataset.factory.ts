import { ChartBarSettings } from "../bar-chart/chart-bar.settings";
import { ChartDataModel } from "../../../models";
import { ChartConstants } from "../../../models/chart-constants";
import { IChartDataset } from "../models/i-chart-dataset";

// noinspection JSSuspiciousNameCombination
export class ChartBarDatasetFactory {
  public static build(
    settings: ChartBarSettings,
    data: (ChartDataModel | number | null | undefined)[],
  ): IChartDataset<'bar', ChartDataModel[]> {
    return {
      backgroundColor: settings.color,
      barThickness: settings.thickness,
      data: data,
      id: settings.id,
      label: settings.name,
      order: settings.order,
      type: 'bar',
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
    } as IChartDataset<'bar', ChartDataModel[]>;
  }
}
