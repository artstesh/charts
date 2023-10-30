

// noinspection JSSuspiciousNameCombination
import { ChartConstants } from "../../../models/chart-constants";
import { ChartDataset } from "chart.js";
import { ChartLineSettings } from "../line-chart/chart-line.settings";
import { ChartDataModel } from "../../../models";

export class ChartLineDatasetFactory{
  public static build(settings: ChartLineSettings, data: ChartDataModel[]): ChartDataset<'line', ChartDataModel[]> {
    return {
      type: 'line',
      data: data,
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      label: settings.name,
      borderColor: settings.color,
      backgroundColor: settings.color,
      pointRadius: settings.pointRadius,
      order: settings.order
    } as ChartDataset<'line', ChartDataModel[]>;
  }
}
