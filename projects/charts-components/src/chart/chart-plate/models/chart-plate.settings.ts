import { IChartElementSettings } from '../../models/i-chart-element.settings';

export type InteractMode = 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y';

export class ChartPlateSettings implements IChartElementSettings<ChartPlateSettings> {
  public interactionMode: InteractMode = 'x';

  public setMode(mode: InteractMode): this {
    this.interactionMode = mode;
    return this;
  }

  copy(model: ChartPlateSettings): ChartPlateSettings {
    return new ChartPlateSettings().setMode(model.interactionMode);
  }

  isSame(model: ChartPlateSettings): boolean {
    if (this.interactionMode !== model.interactionMode) return false;
    return true;
  }
}
