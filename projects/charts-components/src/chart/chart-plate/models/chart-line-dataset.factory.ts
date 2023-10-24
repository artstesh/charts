import { ChartElementType, ChartPlateDatasetFactory } from "./chart-plate-dataset.factory";
import { ChartDataModel } from "../../models";
import { ChartDataset, ScaleOptionsByType, ScriptableContext } from "chart.js";
import { AnyObject } from "chart.js/types/basic";
import { ChartConstants } from "../../models/chart-constants";
import { XLinearAxisSettings } from "../chart-elements/axes/x-linear-axis/x-linear-axis.settings";
import { ChartLineSettings } from "../chart-types/line-chart/chart-line.settings";

// noinspection JSSuspiciousNameCombination
export class ChartLineDatasetFactory extends ChartPlateDatasetFactory{
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
