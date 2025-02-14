import { Injectable } from '@angular/core';
import { ScaleOptionsByType } from 'chart.js';
import { OrdinateAxisSettings } from './ordinate-axis.settings';
import { ChartConstants } from '../../../../models/chart-constants';

@Injectable({
  providedIn: 'root',
})
export class OrdinateAxisFactory {
  public build(settings: OrdinateAxisSettings): ScaleOptionsByType<'linear'> {
    return {
      type: 'linear',
      display: 'auto',
      grid: { display: settings.displayGrid },
      axis: ChartConstants.LeftAxisId,
      offset: true,
      position: settings.right ? 'right' : 'left',
      title: settings.titleSettings
        ? {
            display: true,
            text: settings.titleSettings.text,
            align: settings.titleSettings.align,
            font: settings.titleSettings.font,
            color: settings.titleSettings.color,
            padding: {
              y: settings.titleSettings.paddingY,
              top: settings.titleSettings.paddingTop,
              bottom: settings.titleSettings.paddingBottom,
            },
          }
        : undefined,
    } as ScaleOptionsByType<'linear'>;
  }
}
