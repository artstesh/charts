import { ChartTypeSettings } from '../models/chart-type.settings';

export class ChartBarSettings extends ChartTypeSettings<ChartBarSettings> {
  thickness?: number;
  indexAxis?: 'x' | 'y';

  public setThickness(thickness: number | undefined): ChartBarSettings {
    return this.copy({ ...this, thickness });
  }

  public setIndexAxis(indexAxis: 'x' | 'y' | undefined): ChartBarSettings {
    return this.copy({ ...this, indexAxis });
  }

  protected _isSame(model: ChartBarSettings): boolean {
    if (this.thickness !== model.thickness) return false;
    if (this.indexAxis !== model.indexAxis) return false;
    return true;
  }

  protected _copy(model: ChartBarSettings): ChartBarSettings {
    const result = new ChartBarSettings();
    result.thickness = model.thickness;
    result.indexAxis = model.indexAxis;
    return result;
  }
}
