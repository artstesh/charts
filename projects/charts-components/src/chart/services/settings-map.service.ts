import { Injectable } from '@angular/core';
import { XLinearAxisScaleFactory } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis-scale.factory';
import { XLinearAxisSettings } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis.settings';
import { ChartConfiguration, ChartDataset, ScaleOptionsByType } from 'chart.js';
import { ChartLineSettings } from '../chart-plate/chart-types/line-chart/chart-line.settings';
import { ChartDataModel } from '../models';
import { ChartBarSettings } from '../chart-plate/chart-types/bar-chart/chart-bar.settings';
import { ChartLineDatasetFactory } from '../chart-plate/chart-types/factories/chart-line-dataset.factory';
import { ChartBarDatasetFactory } from '../chart-plate/chart-types/factories/chart-bar-dataset.factory';
import { ChartPlateSettings } from '../chart-plate/models/chart-plate.settings';
import { ChartPlateFactory } from '../chart-plate/models/chart-plate.factory';

@Injectable({
  providedIn: 'root',
})
export class SettingsMapService {
  public chartPlateConfig(settings: ChartPlateSettings): ChartConfiguration {
    return ChartPlateFactory.build(settings);
  }

  public xLinearScale(settings: XLinearAxisSettings): ScaleOptionsByType<'linear'> {
    return XLinearAxisScaleFactory.build(settings);
  }

  public lineDataset(settings: ChartLineSettings, data: ChartDataModel[]): ChartDataset<any, ChartDataModel[]> {
    return ChartLineDatasetFactory.build(settings, data);
  }

  public batDataset(settings: ChartBarSettings, data: ChartDataModel[]): ChartDataset<any, ChartDataModel[]> {
    return ChartBarDatasetFactory.build(settings, data);
  }
}
