import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartBarSettings extends ChartTypeSettings<ChartBarSettings> {
  thickness?: number;

  public setThickness(thickness: number | undefined): ChartBarSettings {
    const result = this.copy(this);
    result.thickness = thickness;
    return result;
  }

  protected _isSame(model: ChartBarSettings): boolean {
    if (this.thickness !== model.thickness) return false;
    return true;
  }

  protected _copy(model: ChartBarSettings): ChartBarSettings {
    const result = new ChartBarSettings();
    result.thickness = model.thickness;
    return result;
  }
}
