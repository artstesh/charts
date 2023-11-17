import { ScaleOptionsByType } from 'chart.js';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';

export class XTimelineAxisFactory {
  public static build(settings: XTimelineAxisSettings): ScaleOptionsByType<'time'> {
    return {
      type: 'time',
      display: 'auto',
      grid: { display: settings.displayGrid },
      min: settings.limits[0],
      max: settings.limits[1],
      ticks: {
        callback: function (val: number, index: number) {
          return new Date(val).toLocaleDateString(settings.locale, settings.dateFormat);
        },
      },
    } as unknown as ScaleOptionsByType<'time'>;
  }
}
