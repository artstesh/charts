import { ChartPlateDatasetFactory } from "./chart-plate-dataset.factory";
import { ChartDataModel } from "../../models";
import { ChartDataset } from "chart.js";
import { ChartConstants } from "../../models/chart-constants";
import { ChartBarSettings } from "../chart-types/bar-chart/chart-bar.settings";

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
