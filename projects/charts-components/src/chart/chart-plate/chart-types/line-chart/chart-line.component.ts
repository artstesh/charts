import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

/**
 * ChartLineComponent is a specialized chart component designed to render line charts.
 * It extends the AbstractChartTypeComponent functionality and provides specific settings
 * and methods for handling line chart data.
 *
 * Features:
 * - Utilizes the SettingsMapService to map configurations to the dataset.
 * - Supports reactive chart data updates using ChartDataEvent.
 * - Implements efficient change detection with OnPush strategy to optimize performance.
 *
 * Inputs:
 * - `data`: Accepts an array of ChartDataModel objects, representing the data points for the line chart.
 *
 * Protected Methods:
 * - `getDataset`: Returns the dataset for the line chart by mapping the settings and provided data.
 *
 * Dependencies:
 * - Depends on InnerPostboyService for event communication.
 * - Depends on ChartPlateService for chart-specific functionalities.
 * - Depends on SettingsMapService for mapping settings to datasets.
 */
@Component({
  selector: 'art-chart-line',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent extends AbstractChartTypeComponent<ChartLineSettings> {
  protected _settings: ChartLineSettings = new ChartLineSettings();

  /**
   * Initializes a new instance of the class.
   *
   * @param {InnerPostboyService} postboy - The postboy service used for inner communication.
   * @param {ChartPlateService} service - The chart plate service utilized for managing chart operations.
   * @param {SettingsMapService} mapService - The settings map service used for mapping configurations.
   * @return {void} No return value as this is a constructor.
   */
  constructor(postboy: InnerPostboyService, service: ChartPlateService, private mapService: SettingsMapService) {
    super(postboy, service);
  }

  /**
   * Represents the chart data used within the application.
   * This variable is an array of ChartDataModel objects, each of which
   * contains the necessary information to render a specific dataset
   * in a chart visualization.
   *
   * The ChartDataModel typically includes properties describing labels,
   * values, and other metadata relevant to the dataset.
   */
  private _data!: ChartDataModel[];

  /**
   * Sets the chart data and triggers events related to data updates.
   * Fires a `ChartDataEvent` and invokes the `dataUpdated` method upon setting the data.
   *
   * @param {ChartDataModel[]} aw - The new chart data to be set.
   */
  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected getDataset = () => [this.mapService.lineDataset(this._settings, this._data)];
}
