import { IChartElementSettings } from '../../models/i-chart-element.settings';

export type InteractMode = 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';

export class ChartPlateSettings implements IChartElementSettings<ChartPlateSettings> {
  public interactionMode: InteractMode = 'nearest';
  public type: 'line' | 'doughnut' = 'line';

  public setMode(interactionMode: InteractMode): ChartPlateSettings {
    return this.copy({ ...this, interactionMode });
  }

  public setType(type: 'line' | 'doughnut'): ChartPlateSettings {
    return this.copy({ ...this, type });
  }

  copy(model: ChartPlateSettings): ChartPlateSettings {
    const result = new ChartPlateSettings();
    result.interactionMode = model.interactionMode;
    result.type = model.type;
    return result;
  }

  isSame(model: ChartPlateSettings): boolean {
    if (this.interactionMode !== model.interactionMode) return false;
    if (this.type !== model.type) return false;
    return true;
  }
}
