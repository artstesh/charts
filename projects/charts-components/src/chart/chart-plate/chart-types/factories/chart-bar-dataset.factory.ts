import { ChartDataset } from "chart.js";
import { ChartBarSettings } from "../bar-chart/chart-bar.settings";
import { ChartDataModel } from "../../../models";
import { ChartConstants } from "../../../models/chart-constants";

// noinspection JSSuspiciousNameCombination
export class ChartBarDatasetFactory{
  public static build(settings: ChartBarSettings, data: ChartDataModel[]): ChartDataset<'bar', ChartDataModel[]> {
    return {
      type: 'bar',
      data: data,
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      label: settings.name,
      backgroundColor: settings.color,
      barThickness: settings.thickness,
      order: settings.order
    } as ChartDataset<'bar', ChartDataModel[]>;
  }
}
