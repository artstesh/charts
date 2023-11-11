import { LayoutPosition } from 'chart.js';
import { Align } from "chart.js/dist/types";

export class ChartLegendSettings {
  align: Align = 'center';
  position: LayoutPosition = 'bottom';

  public isSame(model: ChartLegendSettings): boolean {
    if (this.align !== model.align) return false;
    return this.position === model.position;
  }

  public setAlign(value: Align): this {
    this.align = value;
    return this;
  }

  public setPosition(value: LayoutPosition): this {
    this.position = value;
    return this;
  }

  public static copy(model: ChartLegendSettings): ChartLegendSettings {
    return new ChartLegendSettings().setAlign(model.align).setPosition(model.position);
  }
}
