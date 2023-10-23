import { ScaleOptionsByType } from 'chart.js';
import { XLinearAxisSettings } from './x-linear-axis.settings';

export class XLinearAxisScaleFactory {
  public static build(settings: XLinearAxisSettings): ScaleOptionsByType<'linear'> {
    return {
      type: 'linear',
      display: 'auto',
      grid: { display: settings.displayGrid },
      min: settings.limits[0],
      max: settings.limits[1],
    } as ScaleOptionsByType<'linear'>;
  }
}
