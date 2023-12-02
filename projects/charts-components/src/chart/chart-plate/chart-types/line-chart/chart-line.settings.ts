import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartLineSettings extends ChartTypeSettings<ChartLineSettings> {
  pointRadius: number = 5;

  public setPointRadius(pointRadius: number): ChartLineSettings {
    const result = this.copy(this);
    result.pointRadius = pointRadius;
    return result;
  }

  protected _isSame(model: ChartLineSettings): boolean {
    if (this.pointRadius !== model.pointRadius) return false;
    return true;
  }

  protected _copy(model: ChartLineSettings): ChartLineSettings {
    const result = new ChartLineSettings();
    result.pointRadius = model.pointRadius;
    return result;
  }
}
