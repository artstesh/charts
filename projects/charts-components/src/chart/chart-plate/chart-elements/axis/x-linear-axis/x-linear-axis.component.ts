import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartConstants } from '../../../../models/chart-constants';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

/**
 * Represents a linear axis component for a chart, used to define and manage the behavior
 * and appearance of a linear axis on the x-axis. This component works within the charting
 * library to set and reset the axis scale according to the provided settings.
 *
 * This component is standalone and employs an OnPush change detection strategy for optimization.
 *
 * The component extends `DestructibleComponent` to handle reactive subscriptions and implement
 * the necessary cleanup logic.
 *
 * Dependencies:
 * - `InnerPostboyService`: Manages event subscriptions within the charting system.
 * - `ChartPlateService`: Responsible for managing chart scaling and dimensions.
 * - `SettingsMapService`: Provides mapping and scaling configurations based on component-specific settings.
 *
 * Usage Notes:
 * - Accepts input of type `XLinearAxisSettings` via the `settings` input property.
 * - Automatically updates the axis scale when new settings differing from the current ones are provided.
 * - Listens for chart initialization events to set up the axis.
 * - Ensures cleanup of resources and resets the axis when destroyed.
 *
 * Key Methods:
 * - `setAxis()`: Configures the x-axis scale using the current settings.
 * - `resetAxis()`: Resets the x-axis scale to its default state.
 */
@Component({
  selector: 'art-x-linear-axis',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XLinearAxisComponent extends DestructibleComponent implements OnInit {
  /**
   * Creates an instance of the class.
   *
   * @param {InnerPostboyService} postboy - The service responsible for handling internal postboy operations.
   * @param {ChartPlateService} service - The service managing chart plate functionalities.
   * @param {SettingsMapService} mapService - The service used for managing settings and mapping configurations.
   * @return {void} Does not return a value.
   */
  constructor(
    private postboy: InnerPostboyService,
    private service: ChartPlateService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  /**
   * Represents the configuration settings for a linear axis in a chart or graph.
   * The `_settings` variable is an instance of the `XLinearAxisSettings` class,
   * which encapsulates properties and methods for handling the behavior and
   * appearance of the linear axis.
   */
  _settings: XLinearAxisSettings = new XLinearAxisSettings();

  /**
   * Setter for the `settings` property. Updates the internal axis settings and triggers the axis configuration process if the new value differs from the current one.
   *
   * @param {XLinearAxisSettings | undefined} value - The new axis settings to be applied. If the value is `undefined` or identical to the current settings, no action is performed.
   */
  @Input() set settings(value: XLinearAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized the component.
   * Subscribes to the ChartInitializedEvent to execute axis configuration when the event is emitted.
   * Pushes the subscription into the `subs` array for later cleanup.
   *
   * @return {void} Does not return a value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setAxis()));
  }

  /**
   * Configures and sets the axis scale for the chart.
   *
   * This method sets the scale for the bottom axis of the chart using
   * a linear scale derived from the current settings and mapService.
   *
   * @return {void} No return value.
   */
  setAxis(): void {
    this.service.setScale(ChartConstants.BottomAxisId, this.mapService.xLinearScale(this._settings));
  }

  /**
   * A function invoked to perform cleanup tasks when an object is being destroyed.
   *
   * This method resets the axis state and unsubscribes from all active subscriptions
   * to prevent memory leaks and ensure proper resource management.
   *
   * @function
   */
  onDestroy = () => {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  };

  /**
   * Resets the axis scale to its default state by invoking the resetScale method
   * on the associated service for the specified axis ID.
   *
   * @return {void} Does not return a value.
   */
  private resetAxis(): void {
    this.service.resetScale(ChartConstants.BottomAxisId);
  }
}
