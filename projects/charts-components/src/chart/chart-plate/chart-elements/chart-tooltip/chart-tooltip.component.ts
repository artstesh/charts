import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../common/destructible.component';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartTooltipSettings } from './chart-tooltip.settings';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';

/**
 * ChartTooltipComponent is responsible for managing the tooltip settings and behavior for a chart.
 * It extends DestructibleComponent to handle resource cleanup and implements OnInit and OnDestroy lifecycle hooks for initialization and cleanup logic.
 *
 * This component works in conjunction with ChartPlateService, InnerPostboyService, and SettingsMapService
 * to configure and manage tooltip presentation dynamically based on input settings and events.
 *
 * Key Features:
 * - Supports dynamic tooltip configuration updates.
 * - Listens to a `ChartInitializedEvent` event to reconfigure the tooltip when required.
 * - Ensures tooltip is cleared during the component destruction phase.
 *
 * Inputs:
 * - `settings`: Accepts an object of type `ChartTooltipSettings` to update tooltip configuration.
 *
 * Private Methods:
 * - `setTooltip`: Configures the tooltip by invoking appropriate service methods based on input settings.
 * - `eliminateTip`: Clears the existing tooltip configuration to ensure proper cleanup.
 */
@Component({
  selector: 'art-chart-tooltip',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTooltipComponent extends DestructibleComponent implements OnInit, OnDestroy {
  /**
   * Constructs an instance of the class and initializes required services.
   *
   * @param {ChartPlateService} service - The service responsible for managing chart plate operations.
   * @param {InnerPostboyService} postboy - The service that handles internal posting mechanisms.
   * @param {SettingsMapService} mapService - The service for managing the settings map functionality.
   * @return {void}
   */
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  /**
   * A variable that stores an instance of ChartTooltipSettings.
   * It is used to configure settings related to chart tooltips.
   */
  _settings: ChartTooltipSettings = new ChartTooltipSettings();

  /**
   * Sets the tooltip settings for the chart. Updates the internal settings object
   * and triggers the tooltip setup process if the provided settings differ from
   * the current ones.
   *
   * @param {ChartTooltipSettings | undefined} value - The new tooltip settings to apply.
   * If undefined or identical to the current settings, no changes are made.
   */
  @Input() set settings(value: ChartTooltipSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setTooltip();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Sets up a subscription to the `ChartInitializedEvent` to trigger the `setTooltip` method when the event occurs.
   *
   * @return {void} This method does not return a value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setTooltip()));
  }

  /**
   * Callback function that is executed to handle cleanup or teardown logic.
   * This method is typically triggered before the associated component or
   * resource is destroyed.
   *
   * Specifically, this implementation invokes the `eliminateTip` method,
   * which is presumed to perform the necessary operations to finalize
   * or remove any tooltip or related resource tied to the component instance.
   */
  onDestroy = () => {
    this.eliminateTip();
  };

  /**
   * Updates the tooltip setting by configuring it through the map service.
   *
   * This method retrieves tooltip settings using the provided configuration
   * and applies them to the service for use within the application.
   *
   * @return {void} Does not return a value.
   */
  private setTooltip(): void {
    this.service.setTooltip(this.mapService.tooltip(this._settings));
  }

  /**
   * Eliminates the tooltip by setting it to an empty object.
   *
   * @return {void} This method does not return a value.
   */
  private eliminateTip(): void {
    this.service.setTooltip({});
  }
}
