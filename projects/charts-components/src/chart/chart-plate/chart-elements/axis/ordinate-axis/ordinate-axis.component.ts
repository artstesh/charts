import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { ChartConstants } from '../../../../models/chart-constants';
import { OrdinateAxisFactory } from './ordinate-axis-factory.service';
import { OrdinateAxisSettings } from './ordinate-axis.settings';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';

/**
 * Component representing the ordinate axis for a chart.
 * Responsible for managing and configuring the axis behavior and properties
 * based on the provided settings.
 *
 * This component functions as a standalone component with change detection
 * strategy set to OnPush to enhance performance by minimizing unnecessary
 * change detection cycles.
 *
 * Extends:
 * - DestructibleComponent: For proper subscription management and cleanup of resources.
 *
 * Implements:
 * - OnInit: Initializes component logic when the component is created.
 *
 * Properties:
 * - Input `settings`: Configuration settings for the ordinate axis. If the settings are the same
 *   as the previous value, no action is performed. Otherwise, the axis is updated using these settings.
 *
 * Methods:
 * - ngOnInit: Subscribes to the `ChartInitializedEvent` to initialize the axis when the event is emitted.
 * - setAxis: Configures the axis scale based on the current settings using the ChartPlateService and
 *   OrdinateAxisFactory.
 * - onDestroy: Resets the axis configuration and cleans up all resources and subscriptions.
 * - resetAxis: Resets the scale of the axis back to its default state using ChartPlateService.
 *
 * Dependency Injection:
 * - ChartPlateService: Manages the chart scale configurations.
 * - InnerPostboyService: A messaging service for subscribing to chart-related events.
 * - OrdinateAxisFactory: Builds the axis scale configuration using the provided settings.
 */
@Component({
  selector: 'art-ordinate-axis',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdinateAxisComponent extends DestructibleComponent implements OnInit {
  private axisId = ChartConstants.LeftAxisId;

  /**
   * Constructor for initializing the class with required services.
   *
   * @param {ChartPlateService} service - An instance of ChartPlateService for handling chart-related functionality.
   * @param {InnerPostboyService} postboy - An instance of InnerPostboyService for managing internal communications or operations.
   * @param {OrdinateAxisFactory} mapService - An instance of OrdinateAxisFactory for managing mappings or axis-related operations.
   * @return {void}
   */
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: OrdinateAxisFactory,
  ) {
    super();
  }

  /**
   * Configuration object for ordinate axis settings.
   *
   * This variable holds an instance of `OrdinateAxisSettings` which defines
   * the settings and properties related to the ordinate axis in the given
   * context, such as charts, graphs, or other data visualization components.
   *
   * It is used to manage and customize the behavior and appearance of the ordinate axis.
   */
  _settings: OrdinateAxisSettings = new OrdinateAxisSettings();

  /**
   * Updates the settings for the ordinate axis. If the new settings are undefined or the same as the current settings, no changes are made.
   * If the new settings differ, they are applied, and the axis is reconfigured accordingly.
   *
   * @param {OrdinateAxisSettings | undefined} value The new settings to be applied to the ordinate axis.
   */
  @Input() set settings(value: OrdinateAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Subscribes to the `ChartInitializedEvent` and triggers the `setAxis` method upon event emission.
   * The subscription is added to the `subs` array for proper cleanup.
   *
   * @return {void} Does not return a value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setAxis()));
  }

  /**
   * Configures and sets the axis for the current settings.
   *
   * This method uses the provided settings to determine the axis ID
   * and builds the configuration through the map service. The resulting
   * scale is then applied.
   *
   * @return {void} This method does not return a value.
   */
  setAxis(): void {
    this.service.setScale(this._settings.getAxisId(), this.mapService.build(this._settings));
  }

  /**
   * A callback function executed during the destruction phase of the component or object.
   * This function resets the axis and cleans up any active subscriptions
   * to prevent memory leaks and ensure proper resource management.
   */
  onDestroy = () => {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  };

  /**
   * Resets the axis to its default state by invoking the service's resetScale method
   * using the axis ID retrieved from the settings.
   *
   * @return {void} This method does not return a value.
   */
  private resetAxis(): void {
    this.service.resetScale(this._settings.getAxisId());
  }
}
