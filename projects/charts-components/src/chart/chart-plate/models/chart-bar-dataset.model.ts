import { ChartElementType, ChartPlateDatasetModel } from "./chart-plate-dataset.model";
import { ChartDataModel } from "../../models";
import { ChartDataset, ScriptableContext } from "chart.js";
import { AnyObject } from "chart.js/types/basic";
import { ChartConstants } from "../../models/chart-constants";

// noinspection JSSuspiciousNameCombination
export class ChartBarDatasetModel extends ChartPlateDatasetModel{

  public constructor(label: string, data: ChartDataModel[]) {
    super('bar', label, data);
    (this.dataset as ChartDataset<'bar'>).xAxisID = ChartConstants.BottomAxisName;
    (this.dataset as ChartDataset<'bar'>).yAxisID = ChartConstants.LeftAxisName;
  }

  public rightAxis(): this {
    (this.dataset as ChartDataset<'bar'>).yAxisID = ChartConstants.RightAxisName;
    return this;
  }

  public thickness(value: number | undefined): this {
    (this.dataset as ChartDataset<'bar'>).barThickness = value;
    return this;
  }
}
