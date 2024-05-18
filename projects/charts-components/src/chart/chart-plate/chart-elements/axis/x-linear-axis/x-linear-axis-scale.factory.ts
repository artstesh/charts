import { ScaleOptionsByType } from 'chart.js';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ChartAxisLimitsModel } from '../../../../models/chart-axis-limits.model';

export class XLinearAxisScaleFactory {
  public static build(settings: XLinearAxisSettings, limits?: ChartAxisLimitsModel): ScaleOptionsByType<'linear'> {
    return {
      type: 'linear',
      display: 'auto',
      grid: { display: settings.displayGrid },
      min: limits?.minX,
      max: limits?.maxX,
      offset: true,
      ticks: { maxRotation: settings.maxRotation },
    } as ScaleOptionsByType<'linear'>;
  }
}
