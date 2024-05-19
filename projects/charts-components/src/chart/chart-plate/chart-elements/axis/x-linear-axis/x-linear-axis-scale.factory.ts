import { ScaleOptionsByType } from 'chart.js';
import { XLinearAxisSettings } from './x-linear-axis.settings';

export class XLinearAxisScaleFactory {
  public static build(settings: XLinearAxisSettings): ScaleOptionsByType<'linear'> {
    return {
      type: 'linear',
      display: 'auto',
      grid: { display: settings.displayGrid },
      offset: true,
      ticks: { maxRotation: settings.maxRotation },
    } as ScaleOptionsByType<'linear'>;
  }
}
