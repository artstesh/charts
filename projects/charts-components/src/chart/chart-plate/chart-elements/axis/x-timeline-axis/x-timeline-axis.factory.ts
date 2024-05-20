import { ScaleOptionsByType } from 'chart.js';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';

export class XTimelineAxisFactory {
  public static build(settings: XTimelineAxisSettings): ScaleOptionsByType<'time'> {
    return {
      type: 'time',
      display: 'auto',
      grid: { display: settings.displayGrid },
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
