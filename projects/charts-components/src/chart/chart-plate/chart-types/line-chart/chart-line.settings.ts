import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartLineSettings extends ChartTypeSettings<ChartLineSettings> {
  pointRadius: number = 3;
  fill: false | 'start' | 'end' | 'origin' = false;
  tension: number = 0;
  borderWidth?: number;
  segments?: [number, number];
  borderDash: number[] = [];

  public setBorderWidth(borderWidth: number): ChartLineSettings {
    return this.copy({ ...this, borderWidth });
  }

  public setPointRadius(pointRadius: number): ChartLineSettings {
    return this.copy({ ...this, pointRadius });
  }

  public setBorderDash(borderDash: [number, number]): ChartLineSettings {
    return this.copy({ ...this, borderDash });
  }

  public setSegments(segments: [number, number]): ChartLineSettings {
    return this.copy({ ...this, segments });
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
    if (this.segments !== model.segments) return false;
    if (this.borderWidth !== model.borderWidth) return false;
    if (this.borderDash !== model.borderDash) return false;
    return true;
  }

  protected _copy(model: ChartLineSettings): ChartLineSettings {
    const result = new ChartLineSettings();
    result.pointRadius = model.pointRadius;
    result.tension = model.tension;
    result.borderWidth = model.borderWidth;
    result.fill = model.fill;
    result.segments = model.segments;
    result.borderDash = model.borderDash;
    return result;
  }
}
