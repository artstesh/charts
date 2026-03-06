import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

/**
 * A component responsible for rendering bar charts with customizable settings.
 * This component extends the functionality of `AbstractChartTypeComponent` to support
 * bar chart-specific configurations and processing.
 *
 * The component is standalone, uses the OnPush change detection strategy, and communicates
 * with internal services for dataset processing and event handling.
 *
 * Dependencies:
 * - `InnerPostboyService`: Used for event firing and communication.
 * - `ChartPlateService`: Provides chart-related services and utilities.
 * - `SettingsMapService`: Maps settings and data to the required dataset structure for bar charts.
 *
 * Features:
 * - Accepts chart data via the `data` input property and processes it into a suitable dataset structure.
 * - Automatically fires events whenever the input data is updated, ensuring synchronization.
 * - Utilizes customizable settings defined in the `ChartBarSettings` class for bar chart configuration.
 */
@Component({
  selector: 'art-chart-bar',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  protected _settings: ChartBarSettings = new ChartBarSettings();

  /**
   * Creates an instance of the class.
   *
   * @param {InnerPostboyService} postboy - An instance of the InnerPostboyService used for internal communication.
   * @param {ChartPlateService} service - An instance of the ChartPlateService used for chart-related operations.
   * @param {SettingsMapService} mapService - A private instance of the SettingsMapService used for managing map settings.
   * @return {void}
   */
  constructor(postboy: InnerPostboyService, service: ChartPlateService, private mapService: SettingsMapService) {
    super(postboy, service);
  }

  /**
   * Represents a collection of chart data models.
   *
   * This variable is intended to store an array of `ChartDataModel` objects,
   * which encapsulate the data and metadata required to render charts.
   */
  private _data!: ChartDataModel[];

  /**
   * Sets the data for the chart and triggers necessary events and updates.
   *
   * @param {ChartDataModel[]} aw - The array of chart data models to be set.
   */
  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected getDataset = () => [this.mapService.barDataset(this._settings, this._data)];
}
