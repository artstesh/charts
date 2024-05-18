import { ScaleOptionsByType } from 'chart.js';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';
import { ChartAxisLimitsModel } from '../../../../models/chart-axis-limits.model';

export class XTimelineAxisFactory {
  public static build(settings: XTimelineAxisSettings, limits?: ChartAxisLimitsModel): ScaleOptionsByType<'time'> {
    return {
      type: 'time',
      display: 'auto',
      grid: { display: settings.displayGrid },
      min: limits?.minX,
      max: limits?.maxX,
      time: {
        unit: settings.dateUnit,
      },
      ticks: {
        callback: (val: number, index: number) => settings.dateFormat(val, index),
        maxRotation: settings.maxRotation,
      },
      offset: true,
    } as unknown as ScaleOptionsByType<'time'>;
  }
}
