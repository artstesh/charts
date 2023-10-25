import { Injectable } from '@angular/core';
import { XLinearAxisScaleFactory } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis-scale.factory';
import { XLinearAxisSettings } from '../chart-plate/chart-elements/axes/x-linear-axis/x-linear-axis.settings';
import { ChartDataset, ScaleOptionsByType } from "chart.js";
import { ChartLineSettings } from "../chart-plate/chart-types/line-chart/chart-line.settings";
import { ChartDataModel } from "../models";
import { ChartLineDatasetFactory } from "../chart-plate/models/chart-line-dataset.factory";
import { ChartBarSettings } from "../chart-plate/chart-types/bar-chart/chart-bar.settings";
import { ChartBarDatasetFactory } from "../chart-plate/models/chart-bar-dataset.factory";

@Injectable({
  providedIn: 'root',
})
export class SettingsMapService {
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
