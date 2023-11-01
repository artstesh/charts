import { ChartTypeSettings } from "../models/chart-type.settings";

export class ChartLineSettings extends ChartTypeSettings<ChartLineSettings> {
  pointRadius: number = 0;

  public setPointRadius(
    pointRadius: number,
  ): ChartLineSettings {
    this.pointRadius = pointRadius;
    return this;
  }

  protected _isSame(model: ChartLineSettings): boolean {
    if (this.pointRadius !== model.pointRadius) return false;
    return true;
  }

  protected _copy(model: ChartLineSettings): ChartLineSettings {
    return new ChartLineSettings().setPointRadius(model.pointRadius);
  }
}
