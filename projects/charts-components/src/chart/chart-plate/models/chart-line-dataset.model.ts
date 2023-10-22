import { ChartElementType, ChartPlateDatasetModel } from "./chart-plate-dataset.model";
import { ChartDataModel } from "../../models";
import { ChartDataset, ScriptableContext } from "chart.js";
import { AnyObject } from "chart.js/types/basic";
import { ChartConstants } from "../../models/chart-constants";

export class ChartLineDatasetModel extends ChartPlateDatasetModel{

  public constructor(label: string, data: ChartDataModel[]) {
    super('line', label, data);
    (this.dataset as ChartDataset<'line'>).xAxisID = ChartConstants.BottomAxisName;
    (this.dataset as ChartDataset<'line'>).yAxisID = ChartConstants.LeftAxisName;
  }

  public rightAxis(): this {
    (this.dataset as ChartDataset<'line'>).yAxisID = ChartConstants.RightAxisName;
    return this;
  }

  public borderColor(color: string): this {
    (this.dataset as ChartDataset<'line'>).borderColor = color;
    return this;
  }

  public pointRadius(radius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number)): this {
    (this.dataset as ChartDataset<'line'>).pointRadius = radius;
    return this;
  }
}
