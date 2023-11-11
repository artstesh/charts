import { XLinearAxisSettings } from "../../axes/x-linear-axis/x-linear-axis.settings";
import { LegendOptions } from "chart.js";
import { ChartLegendSettings } from "./chart-legend.settings";

export class ChartLegendFactory {

  public static build(settings: ChartLegendSettings): LegendOptions<any> {
    return {
      display: true,
      position: settings.position,
      align: settings.align
    } as  LegendOptions<any>;
  }
}
