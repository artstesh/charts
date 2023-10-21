import { ChartDataModel } from "./chart-data.model";

export interface IChartAxisLimitsModel {
  minX?: number | null;
  maxX?: number | null;
  minY?: number | null;
  maxY?: number | null;
}

export class ChartAxisLimitsModel implements IChartAxisLimitsModel{
  public constructor(
    public minX?: number | null,
    public maxX?: number | null,
    public minY?: number | null,
    public maxY?: number | null,
  ) {}

  public isTheSame(model?: ChartAxisLimitsModel | null): boolean {
    if (!model) return false;
    return model.maxX === this.maxX && model.minX === this.minX && model.minY === this.minY && model.maxY === this.maxY;
  }

  public get rawData(): IChartAxisLimitsModel {
    return {...this};
  }

  public contains(model: ChartDataModel): boolean {
    if ((this.maxX != null && model.x > this.maxX)) return false;
    if ((this.minX != null && model.x < this.minX)) return false;
    if (this.maxY != null && model.y != null && model.y > this.maxY) return false;
    if (this.minY != null && model.y != null && model.y < this.minY) return false;
    return true;
  }
}
