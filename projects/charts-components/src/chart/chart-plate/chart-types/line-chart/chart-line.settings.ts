import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartLineSettings extends ChartTypeSettings<ChartLineSettings> {
  pointRadius: number = 3;
  fill: false | 'start' | 'end' | 'origin' = false;
  tension: number = 0;

  public setPointRadius(pointRadius: number): ChartLineSettings {
    return this.copy({ ...this, pointRadius });
  }

  public setFill(fill: false | 'start' | 'end' | 'origin'): ChartLineSettings {
    return this.copy({ ...this, fill });
  }

  public setTension(tension: number): ChartLineSettings {
    return this.copy({ ...this, tension });
  }

  protected _isSame(model: ChartLineSettings): boolean {
    if (this.pointRadius !== model.pointRadius) return false;
    if (this.fill !== model.fill) return false;
    if (this.tension !== model.tension) return false;
    return true;
  }

  protected _copy(model: ChartLineSettings): ChartLineSettings {
    const result = new ChartLineSettings();
    result.pointRadius = model.pointRadius;
    result.tension = model.tension;
    result.fill = model.fill;
    return result;
  }
}
