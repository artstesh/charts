import { LayoutPosition } from 'chart.js';
import { Align } from 'chart.js/dist/types';

export type LegendPosition = LayoutPosition;
export type LegendAlignment = Align;

export class ChartLegendSettings {
  align: LegendAlignment = 'center';
  position: LegendPosition = 'bottom';

  public isSame(model: ChartLegendSettings): boolean {
    if (this.align !== model.align) return false;
    return this.position === model.position;
  }

  public setAlign(value: LegendAlignment): ChartLegendSettings {
    const result = ChartLegendSettings.copy(this);
    result.align = value;
    return result;
  }

  public setPosition(value: LegendPosition): ChartLegendSettings {
    const result = ChartLegendSettings.copy(this);
    result.position = value;
    return result;
  }

  public static copy(model: ChartLegendSettings): ChartLegendSettings {
    const result = new ChartLegendSettings();
    result.align = model.align;
    result.position = model.position;
    return result;
  }
}
