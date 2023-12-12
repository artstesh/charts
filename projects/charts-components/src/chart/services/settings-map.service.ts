import { Injectable } from '@angular/core';
import { XLinearAxisScaleFactory } from '../chart-plate/chart-elements/axis/x-linear-axis/x-linear-axis-scale.factory';
import { XLinearAxisSettings, XTimelineAxisSettings } from '../chart-plate/chart-elements/axis';
import { ChartConfiguration, LegendOptions, ScaleOptionsByType } from 'chart.js';
import { ChartLineSettings } from '../chart-plate/chart-types/line-chart/chart-line.settings';
import { ChartDataModel } from '../models';
import { ChartBarSettings } from '../chart-plate/chart-types/bar-chart/chart-bar.settings';
import { ChartPlateSettings } from '../chart-plate/models/chart-plate.settings';
import { ChartPlateFactory } from '../chart-plate/models/chart-plate.factory';
import { IChartDataset } from '../chart-plate/chart-types/models/i-chart-dataset';
import { ChartLegendSettings } from '../chart-plate/chart-elements/legend';
import { ChartLegendFactory } from '../chart-plate/chart-elements/legend/chart-legend/chart-legend.factory';
import { XCategoryAxisFactory } from '../chart-plate/chart-elements/axis/x-category-axis/x-category-axis.factory';
import { XTimelineAxisFactory } from '../chart-plate/chart-elements/axis/x-timeline-axis/x-timeline-axis.factory';
import { ChartTooltipSettings } from '../chart-plate/chart-elements/chart-tooltip/chart-tooltip.settings';
import { ChartTooltipFactory } from '../chart-plate/chart-elements/chart-tooltip/chart-tooltip.factory';
import { ChartLineDatasetFactory } from '../chart-plate/chart-types/line-chart/chart-line-dataset.factory';
import { ChartBarDatasetFactory } from '../chart-plate/chart-types/bar-chart/chart-bar-dataset.factory';

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

  public tooltip(settings: ChartTooltipSettings): any {
    return ChartTooltipFactory.build(settings);
  }

  public xTimelineScale(settings: XTimelineAxisSettings): ScaleOptionsByType<'time'> {
    return XTimelineAxisFactory.build(settings);
  }

  public xCategoryScale(labels: string[]): ScaleOptionsByType<'category'> {
    return XCategoryAxisFactory.build(labels);
  }

  public lineDataset(settings: ChartLineSettings, data: ChartDataModel[]): IChartDataset<any, ChartDataModel[]> {
    return ChartLineDatasetFactory.build(settings, data);
  }

  public batDataset(
    settings: ChartBarSettings,
    data: (ChartDataModel | number | null | undefined)[],
  ): IChartDataset<any, ChartDataModel[]> {
    return ChartBarDatasetFactory.build(settings, data);
  }

  public chartLegend(settings: ChartLegendSettings): LegendOptions<any> {
    return ChartLegendFactory.build(settings);
  }
}
