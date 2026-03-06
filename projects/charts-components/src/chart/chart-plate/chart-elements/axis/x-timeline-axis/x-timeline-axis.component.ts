import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartConstants } from '../../../../models/chart-constants';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';

/**
 * Represents a component for rendering and managing the X-axis timeline in a charting system.
 * This component is standalone and leverages Angular's `ChangeDetectionStrategy.OnPush` for optimized performance.
 * It extends the `DestructibleComponent` to manage subscriptions and cleanup upon component destruction.
 *
 * Responsibilities include:
 * - Managing timeline settings through the `settings` input property.
 * - Setting up and updating the X-axis scale based on the provided settings.
 * - Reacting to the chart initialization event to configure the X-axis scale.
 * - Resetting the X-axis scale upon component destruction.
 *
 * Dependencies:
 * - `ChartPlateService`: A service used to configure and reset the X-axis scale.
 * - `InnerPostboyService`: A messaging service used to subscribe to chart-related events, such as `ChartInitializedEvent`.
 * - `SettingsMapService`: A service used to transform and map the timeline axis settings into a usable scale.
 *
 * Lifecycle:
 * - On initialization, the component subscribes to the `ChartInitializedEvent` and configures the X-axis scale accordingly.
 * - On component destruction, the X-axis scale is reset to ensure proper cleanup.
 *
 * Input Properties:
 * - `settings`: Accepts an instance of `XTimelineAxisSettings` which contains the configuration for the X-axis timeline.
 *               If the provided settings differ from the current ones, the axis is reconfigured.
 *
 * Methods:
 * - `ngOnInit`: Lifecycle hook that subscribes to the necessary events for chart initialization and axis setup.
 * - `setAxis`: Configures the X-axis scale based on the current timeline settings.
 * - `onDestroy`: Resets the X-axis scale when the component is destroyed.
 */
@Component({
  selector: 'art-x-timeline-axis',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XTimelineAxisComponent extends DestructibleComponent implements OnInit {
  /**
   * Constructs an instance of the class.
   *
   * @param {ChartPlateService} service - The service responsible for managing chart plates.
   * @param {InnerPostboyService} postboy - The service used for internal message handling or interactions.
   * @param {SettingsMapService} mapService - The service for managing settings and configurations for mapping.
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
   * Represents the configuration settings for the timeline axis.
   * Stores various options and preferences used to customize the appearance
   * and behavior of the timeline axis in the application.
   *
   * @type {XTimelineAxisSettings}
   */
  _settings: XTimelineAxisSettings = new XTimelineAxisSettings();

  /**
   * Updates the settings for the timeline axis. If the provided value is undefined or identical to the current settings, no update is performed. When updated, the axis will be reconfigured with the new settings.
   *
   * @param {XTimelineAxisSettings | undefined} value - The new settings for the timeline axis. If undefined or identical to the current settings, no changes are applied.
   */
  @Input() set settings(value: XTimelineAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of the component.
   * Subscribes to the ChartInitializedEvent to execute axis setup logic when the event is triggered.
   * Ensures the subscription is tracked for proper cleanup to avoid memory leaks.
   *
   * @return {void} This method does not return any value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setAxis()));
  }

  /**
   * Configures and sets the axis scale for the bottom axis of the chart using the provided settings and map service.
   * The method updates the axis scale based on the current configuration of the timeline and chart constants.
   *
   * @return {void} This method does not return a value.
   */
  setAxis(): void {
    this.service.setScale(ChartConstants.BottomAxisId, this.mapService.xTimelineScale(this._settings));
  }

  /**
   * Represents a callback function that is invoked upon the destruction or teardown
   * of the component or instance. The primary purpose of this function is to perform
   * any necessary cleanup operations.
   *
   * This specific implementation resets the scale for the bottom axis of a chart
   * using the `resetScale` method from the service. Ensures the bottom axis is
   * restored to its default state, preventing potential side effects caused by
   * residual configurations.
   *
   * Note: The `ChartConstants.BottomAxisId` is used to identify the axis to be reset.
   */
  onDestroy = () => {
    this.service.resetScale(ChartConstants.BottomAxisId);
  };
}
