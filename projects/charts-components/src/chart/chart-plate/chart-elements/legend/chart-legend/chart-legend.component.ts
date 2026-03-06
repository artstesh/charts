import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartLegendSettings } from './chart-legend.settings';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

/**
 * A component responsible for rendering and managing the chart's legend. It handles the configuration
 * and communication between other services to ensure the chart legend is properly displayed and updated.
 *
 * This component integrates with several services to dynamically render the legend based on the provided
 * settings and the lifecycle of the chart.
 *
 * Extends:
 * - `DestructibleComponent`: To manage subscriptions and cleanup when the component is destroyed.
 *
 * Implements:
 * - `OnInit`: Performs initialization logic when the component is created.
 * - `OnDestroy`: Handles cleanup logic when the component is destroyed.
 *
 * Inputs:
 * - `settings`: Accepts an instance of `ChartLegendSettings` or `undefined`. The settings determine
 *   the structure and appearance of the legend. If the settings are updated and differ from the existing
 *   configuration, the legend is updated accordingly.
 *
 * Dependencies:
 * - `ChartPlateService`: Provides functionality for setting chart legend configurations.
 * - `InnerPostboyService`: Acts as a message broker, used to subscribe to and handle events.
 * - `SettingsMapService`: Responsible for mapping chart settings, including legend configurations.
 *
 * Lifecycle:
 * - `ngOnInit`: Subscribes to the `ChartInitializedEvent` to ensure the legend is set after the chart is initialized.
 * - `onDestroy`: Invoked when the component is destroyed, cleaning up the legend from the chart.
 *
 * Methods:
 * - `setLegend()`: Configures and sets the legend using the current service and mapped settings.
 * - `removeLegend()`: Resets or removes the legend entirely by clearing its configuration.
 */
@Component({
  selector: 'art-chart-legend',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegendComponent extends DestructibleComponent implements OnInit, OnDestroy {
  /**
   * Constructs a new instance of the class.
   *
   * @param {ChartPlateService} service - An instance of the ChartPlateService used for chart-related operations.
   * @param {InnerPostboyService} postboy - An instance of the InnerPostboyService used for internal communication handling.
   * @param {SettingsMapService} mapService - An instance of the SettingsMapService used for managing settings maps.
   * @return {void} Nothing is returned as this is a constructor.
   */
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  /**
   * Configuration object for defining the settings of a chart legend.
   *
   * This variable holds an instance of `ChartLegendSettings`, which is used
   * to customize the appearance, behavior, and positioning of the chart legend
   * within the visualization. Modifications to this object will dynamically
   * affect how the legend is rendered in the chart.
   */
  _settings: ChartLegendSettings = new ChartLegendSettings();

  /**
   * Sets the chart legend settings and updates the legend if the provided value is different from the current settings.
   *
   * @param {ChartLegendSettings | undefined} value - The new legend settings to apply. If undefined or identical to the current settings, no updates are made.
   */
  @Input() set settings(value: ChartLegendSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setLegend();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Subscribes to the ChartInitializedEvent and triggers the setLegend method upon receiving the event.
   *
   * @return {void} Does not return a value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setLegend()));
  }

  /**
   * Configures and sets the legend for the chart using the provided settings and service dependencies.
   * This method interacts with the map service to generate a chart legend based on the specified settings
   * and applies it to the chart.
   *
   * @return {void} This method does not return a value.
   */
  setLegend(): void {
    this.service.setLegend(this.mapService.chartLegend(this._settings, this.postboy));
  }

  /**
   * A function executed during the destruction or cleanup phase of a component or object.
   * This method is responsible for removing the legend associated with the current instance.
   * It ensures that resources or elements linked to the legend are properly released.
   */
  onDestroy = () => {
    this.removeLegend();
  };

  /**
   * Removes the legend by setting it to an empty object.
   *
   * @return {void} No value is returned from this method.
   */
  private removeLegend(): void {
    this.service.setLegend({} as any);
  }
}
