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
    } as ScaleOptionsByType<'linear'>;
  }
}
