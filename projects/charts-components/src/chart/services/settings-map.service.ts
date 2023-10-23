import { Injectable } from '@angular/core';
import { XLinearAxisScaleFactory } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis-scale.factory';
import { XLinearAxisSettings } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis.settings';
import { ScaleOptionsByType } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class SettingsMapService {
  public xLinearAxis(settings: XLinearAxisSettings): ScaleOptionsByType<'linear'> {
    return XLinearAxisScaleFactory.build(settings);
  }
}
