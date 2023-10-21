import { ChartTypeSettings } from "../models/chart-type.settings";
import { ScriptableContext } from "chart.js";
import { AnyObject } from "chart.js/types/basic";

export class ChartLineSettings extends ChartTypeSettings{
  pointRadius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number) = 0;

  public isSame(model: ChartLineSettings): boolean {
    if (this.order !== model.order) return false;
    if (this.name !== model.name) return false;
    if (this.color !== model.color) return false;
    if (this.pointRadius !== model.pointRadius) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }
}
