import { ChartPlateDatasetFactory } from "./chart-plate-dataset.factory";
import { ChartDataModel } from "../../models";
import { ChartDataset } from "chart.js";
import { ChartConstants } from "../../models/chart-constants";
import { ChartBarSettings } from "../chart-types/bar-chart/chart-bar.settings";

// noinspection JSSuspiciousNameCombination
export class ChartBarDatasetFactory extends ChartPlateDatasetFactory{
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

  public constructor(label: string, data: ChartDataModel[]) {
    super('bar', label, data);
    (this.dataset as ChartDataset<'bar'>).xAxisID = ChartConstants.BottomAxisId;
    (this.dataset as ChartDataset<'bar'>).yAxisID = ChartConstants.LeftAxisId;
  }

  public rightAxis(): this {
    (this.dataset as ChartDataset<'bar'>).yAxisID = ChartConstants.RightAxisId;
    return this;
  }

  public thickness(value: number | undefined): this {
    (this.dataset as ChartDataset<'bar'>).barThickness = value;
    return this;
  }
}
