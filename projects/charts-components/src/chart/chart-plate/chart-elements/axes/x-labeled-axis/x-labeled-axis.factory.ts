import { ScaleOptionsByType } from 'chart.js';
import { XLabeledAxisSettings } from './x-labeled-axis.settings';

export class XLabeledAxisFactory {
  public static build(settings: XLabeledAxisSettings): ScaleOptionsByType<any> {
    return {
      display: 'auto',
      grid: { display: settings.displayGrid },
    } as ScaleOptionsByType<any>;
  }
}
