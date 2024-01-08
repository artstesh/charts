import { ChartDataModel } from './chart-data.model';

export interface IChartAxisLimitsModel {
  minX?: number | null;
  maxX?: number | null;
}

export class ChartAxisLimitsModel implements IChartAxisLimitsModel {
  public constructor(public minX?: number | null, public maxX?: number | null) {}

  public get rawData(): IChartAxisLimitsModel {
    return { ...this };
  }

  public isTheSame(model?: ChartAxisLimitsModel | null): boolean {
    if (!model) return false;
    return model.maxX === this.maxX && model.minX === this.minX;
  }

  public contains(model: ChartDataModel): boolean {
    if (this.maxX != null && model.x > this.maxX) return false;
    if (this.minX != null && model.x < this.minX) return false;
    return true;
  }
}
