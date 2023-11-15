import { XLinearAxisSettings } from "../x-linear-axis/x-linear-axis.settings";
import { ScaleOptionsByType } from "chart.js";

export class XCategoryAxisFactory {
  public static build(labels: string[]): ScaleOptionsByType<'category'> {
    return {
      type: 'category',
      display: 'auto',
      grid: { display: false },
      labels: labels
    } as ScaleOptionsByType<'category'>;
  }
}
