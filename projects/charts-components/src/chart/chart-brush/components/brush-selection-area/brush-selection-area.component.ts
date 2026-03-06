import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';
import { BrushRangeModel } from '../../models/brush-range.model';
import { DestructibleComponent } from '../../../common/destructible.component';
import { Subscription } from 'rxjs';
import { BrushAreaEvent } from '../../messages/events/brush-area.event';
import { ZoomAreaCommand } from '../../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../../messages/commands/move-brush.command';
import { ChartScrollEvent } from '../../../messages/events/chart-scroll.event';
import { BrushKnobComponent } from './brush-knob/brush-knob.component';

/**
 * A UI component responsible for handling the brush selection area functionality within a chart.
 * This component allows users to interact with a brushable area to select specific parts of the chart,
 * and responds to user input such as mouse or touch gestures.
 *
 * The component leverages `@ViewChild` for DOM manipulation, reactive subscriptions for event handling,
 * and communicates with the backend services via `InnerPostboyService`.
 * Change detection is optimized with the `OnPush` strategy to improve performance.
 *
 * Inherits from:
 * - `DestructibleComponent`: Provides a mechanism for managing subscriptions and performing cleanup.
 *
 * Implements:
 * - `OnInit`: Lifecycle hook to initialize necessary data and subscriptions.
 * - `OnDestroy`: Lifecycle hook to clean up resources when the component is destroyed.
 *
 * Responsibilities:
 * - Observes the parent chart configuration and updates the brush selection area accordingly.
 * - Listens to scroll and mouse events to dynamically adjust or move the brushable area.
 * - Communicates user interactions back to the service layer using commands.
 *
 * Dependencies:
 * - `InnerPostboyService`: A service used for pub-sub style communication between components or modules.
 * - `ChangeDetectorRef`: Used to trigger Angular's change detection manually when necessary.
 *
 * Key Functionality:
 * - Responds to `ChartScrollEvent` to handle zooming functionality.
 * - Responds to `MouseEvent` and `TouchEvent` for brush area interactions:
 *   - `mousedown()`: Begins the interaction when the user presses down.
 *   - `mousemove()`: Updates the position of the brush area based on user movement.
 * - Observes `ChartInitializedEvent` to retrieve the chart instance and update state.
 * - Observes `BrushAreaEvent` to update the visual representation of the selected area.
 *
 * Members:
 * - `mainChart`: The parent chart instance tied to the brush area.
 * - `plate`: A DOM reference to the brush area element.
 * - `scrollRange`: A constant controlling the range of scrolling behavior.
 * - `areaMinSize`: A constant defining the minimum size of the brushable area.
 * - `selectedModel`: An optional model representing the currently selected brush range.
 * - `isDown`: Tracks whether a mouse or touch press is active.
 * - `mouseDownPosition`: Tracks the initial position of a mouse or touch press.
 *
 * Lifecycle Hooks:
 * - `ngOnInit()`: Sets up subscriptions for observing chart, area, and scroll events.
 * - `ngOnDestroy()`: Cleans up all subscriptions to prevent memory leaks.
 */
@Component({
  selector: 'art-brush-selection-area',
  standalone: true,
  templateUrl: './brush-selection-area.component.html',
  styleUrls: ['./brush-selection-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrushKnobComponent],
})
export class BrushSelectionAreaComponent extends DestructibleComponent implements OnInit {
  mainChart!: Chart;
  @ViewChild('brushPlate') plate!: ElementRef;
  readonly scrollRange = 16;
  readonly areaMinSize = 100;
  selectedModel?: BrushRangeModel;
  isDown = false;
  private mouseDownPosition = 0;

  /**
   * Constructs an instance of the class.
   *
   * @param {InnerPostboyService} postboy - The instance of InnerPostboyService used for handling internal post operations.
   * @param {ChangeDetectorRef} detector - The ChangeDetectorRef used to trigger detection of changes.
   * @return {void}
   */
  constructor(private postboy: InnerPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  /**
   * Initialization lifecycle hook that is called after Angular has initialized
   * all data-bound properties of the component. This method sets up necessary
   * subscriptions to observe changes in the parent chart, selected area,
   * and parent scroll behaviors.
   *
   * @return {void} Does not return any value.
   */
  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeSelectedArea());
    this.subs.push(this.observeParentScroll());
  }

  /**
   * Observes scroll events on the parent element and triggers a corresponding zoom command
   * based on the scroll direction.
   *
   * @return {Subscription} A subscription object that can be used to manage the lifecycle
   * of the observer.
   */
  private observeParentScroll() {
    return this.postboy
      .sub(ChartScrollEvent)
      .subscribe((ev) =>
        this.postboy.fire(new ZoomAreaCommand(ev.direction === 'down' ? this.scrollRange : -this.scrollRange)),
      );
  }

  /**
   * Cleanup logic that is executed when the component is destroyed.
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   *
   * @return {void} No return value.
   */
  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  /**
   * Handles the mousedown event, initiating actions based on the event type and position.
   *
   * @param {$event} $event The mousedown event, which can be a MouseEvent or TouchEvent.
   * @return {void} Does not return a value.
   */
  mousedown($event: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.mouseDownPosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
  }

  /**
   * Handles mouse or touch movement events while a specific action is active.
   * Prevents the default behavior of the event and calculates the new position
   * to trigger a custom movement command.
   *
   * @param {$event} $event The mouse or touch event to process. Can be an instance of MouseEvent or TouchEvent.
   * @return {void} Does not return a value.
   */
  mousemove($event: MouseEvent | TouchEvent) {
    $event.preventDefault();
    if (this.isDown) {
      const newMousePosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
      this.postboy.fire(new MoveBrushCommand(newMousePosition - this.mouseDownPosition));
      this.mouseDownPosition = newMousePosition;
    }
  }

  /**
   * Observes the parent chart by subscribing to the `ChartInitializedEvent`.
   * Upon receiving the event, assigns the initialized chart to the `mainChart` property
   * and triggers change detection to update the view.
   *
   * @return {Subscription} A subscription object that can be used to manage the lifecycle of the observer.
   */
  private observeParentChart() {
    return this.postboy.sub<ChartInitializedEvent>(ChartInitializedEvent).subscribe((ev) => {
      this.mainChart = ev.chart;
      this.detector.detectChanges();
    });
  }

  /**
   * Observes changes to the selected area triggered by a `BrushAreaEvent`.
   * Updates the `selectedModel` with the new range and adjusts the style
   * of the associated `plate` element to reflect the updated selection.
   * Change detection is manually triggered after each update.
   *
   * @return {Subscription} A subscription to the `BrushAreaEvent` allowing the caller
   *                        to manage or terminate the observation when no longer needed.
   */
  private observeSelectedArea(): Subscription {
    return this.postboy.sub(BrushAreaEvent).subscribe((ev) => {
      if (!this.plate) return;
      this.selectedModel = ev.range;
      this.plate.nativeElement.style.left = ev.range.left + 'px';
      this.plate.nativeElement.style.width = ev.range.width + 'px';
      this.detector.detectChanges();
    });
  }
}
