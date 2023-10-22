import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartBarSettings extends ChartTypeSettings<ChartBarSettings> {
  thickness?: number;

  public setThickness(thickness: number | undefined): ChartBarSettings {
    this.thickness = thickness;
    return this;
  }

  protected _isSame(model: ChartBarSettings): boolean {
    if (this.thickness !== model.thickness) return false;
    return true;
  }

  protected _copy(model: ChartBarSettings): ChartBarSettings {
    return new ChartBarSettings().setThickness(model.thickness);
  }
}
