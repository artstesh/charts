import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

/**
 * A component responsible for defining and managing the X-axis of a category chart.
 * It interacts with chart services to set up and update the X-axis scale based on input labels.
 *
 * The component:
 * - Subscribes to chart initialization events to automatically update the axis.
 * - Reacts to changes in input labels to configure the X-axis scale accordingly.
 * - Releases resources and cleans up subscriptions on destruction.
 *
 * Decorator-driven metadata identifies the component's selector, template, and change detection strategy.
 */
@Component({
  selector: 'art-x-category-axis',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XCategoryAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  private subs: Subscription[] = [];

  /**
   * Constructor for initializing the class dependencies.
   *
   * @param {ChartPlateService} service - An instance of the ChartPlateService used for managing chart-related operations.
   * @param {InnerPostboyService} postboy - An instance of the InnerPostboyService responsible for internal message handling.
   * @param {SettingsMapService} mapService - An instance of the SettingsMapService used for managing mapping and settings.
   */
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {}

  /**
   * A variable that stores an array of label strings.
   *
   * This array is intended to hold textual labels, which can represent
   * identifiers, names, categories, or other string-based descriptors.
   *
   * The array is initialized as empty and can be updated as needed.
   */
  _labels: string[] = [];

  /**
   * Sets the labels for the component. Updates the internal labels array and triggers the axis setup.
   *
   * @param {string[]} value The array of label strings to be set. If the array is empty or null, the method does nothing.
   */
  @Input() set labels(value: string[]) {
    if (!value?.length) return;
    this._labels = value;
    this.setAxis();
  }

  /**
   * A lifecycle hook that is invoked after Angular has initialized the component.
   * It subscribes to the `ChartInitializedEvent` and triggers the `setAxis` method
   * when the event is emitted. The subscription is stored for proper cleanup.
   *
   * @return {void} Does not return any value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setAxis()));
  }

  /**
   * Sets the axis for the component by configuring the scale with the given labels.
   *
   * This method utilizes the service to set the scale of the XCategoryAxisComponent
   * based on the current labels obtained from the map service.
   *
   * @return {void} No return value.
   */
  setAxis(): void {
    this.service.setScale(XCategoryAxisComponent.id, this.mapService.xCategoryScale(this._labels));
  }

  /**
   * Lifecycle hook that is invoked when the component is destroyed.
   * This method performs cleanup tasks such as resetting the axis state
   * and unsubscribing from any active subscriptions to prevent memory leaks.
   *
   * @return {void} This method does not return any value.
   */
  ngOnDestroy(): void {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  }

  /**
   * Resets the axis scale to its default state.
   *
   * @return {void} No value is returned.
   */
  private resetAxis(): void {
    this.service.resetScale(XCategoryAxisComponent.id);
  }
}
