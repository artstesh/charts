import { ChartTypeSettings } from "../models/chart-type.settings";
import { ScriptableContext } from "chart.js";
import { AnyObject } from "chart.js/types/basic";

export class ChartLineSettings extends ChartTypeSettings<ChartLineSettings> {
  pointRadius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number) = 0;

  public setPointRadius(
    pointRadius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number),
  ): ChartLineSettings {
    this.pointRadius = pointRadius;
    return this;
  }

  protected _isSame(model: ChartLineSettings): boolean {
    if (this.pointRadius !== model.pointRadius) return false;
    return true;
  }

  protected _copy(model: ChartLineSettings): ChartLineSettings {
    return new ChartLineSettings().setPointRadius(model.pointRadius);
  }
}
