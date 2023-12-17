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
      time: {
        unit: settings.dateUnit,
      },
      ticks: {
        callback: (val: number, index: number) => settings.dateFormat(val, index),
      },
      offset: true,
    } as unknown as ScaleOptionsByType<'time'>;
  }
}
