import { Component, HostListener, Input, OnInit } from '@angular/core';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { MoveBrushBorderCommand } from '../../../../messages/commands/move-brush-border.command';

/**
 * The BrushKnobComponent is responsible for enabling smooth drag-and-drop interactions to adjust
 * the position of a brush boundary. It handles mouse and touch events to detect user interactions
 * and communicates updates via commands.
 *
 * This component uses Angular's HostListener decorators to observe document-level input events
 * such as mouse or touch movements, enabling responsive and real-time adjustments while the
 * component is being interacted with.
 *
 * Properties:
 * - `side`: Determines the side ('left' or 'right') on which the knob is located. Defaults to 'left'.
 *
 * Methods:
 * - `mousedown($event: MouseEvent | TouchEvent)`: Captures the initial interaction when the user
 *   presses or touches down on the knob. It prevents default behavior and propagation of the event.
 * - `mouseup()`: Resets the drag state when the user releases the mouse button or lifts their finger.
 * - `mouseleave()`: Resets the drag state when the user's cursor or touch action exits the document area.
 * - `mousemove($event: MouseEvent | TouchEvent)`: Facilitates drag functionality, recalculating the
 *   position of the knob based on the movement, and emits an update command.
 */
@Component({
  selector: 'art-brush-knob',
  standalone: true,
  templateUrl: './brush-knob.component.html',
  styleUrls: ['./brush-knob.component.scss'],
})
export class BrushKnobComponent implements OnInit {
  @Input() side: 'left' | 'right' = 'left';
  isDown = false;
  private mouseDownPosition = 0;

  /**
   * Creates an instance of the class with an injected InnerPostboyService.
   *
   * @param {InnerPostboyService} postboy - The service instance used for handling post-related operations.
   * @return {void}
   */
  constructor(private postboy: InnerPostboyService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive or component.
   * This method is typically used for performing any initialization logic required by the component.
   *
   * @return {void} This method does not return any value.
   */
  ngOnInit(): void {}

  /**
   * Handles the mousedown event for both mouse and touch interactions.
   *
   * @param {$event} $event - The event object, which can be either a MouseEvent or a TouchEvent.
   * @return {void} This method does not return a value.
   */
  mousedown($event: MouseEvent | TouchEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.mouseDownPosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
    this.isDown = true;
  }

  /**
   * Event listener method triggered when the mouse button is released (mouseup event)
   * or a touch ends (touchend event) anywhere on the document.
   *
   * This method sets the `isDown` property to `false`.
   *
   * @return {void} No return value.
   */
  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  mouseup() {
    this.isDown = false;
  }

  /**
   * Handles the mouse leave event at the document level.
   * This method is triggered when the mouse cursor leaves the document area.
   *
   * @return {void} No value is returned by this method.
   */
  @HostListener('document:mouseleave', ['$event'])
  mouseleave() {
    this.isDown = false;
  }

  /**
   * Handles mousemove and touchmove events when the user is interacting with the interface.
   *
   * @param {MouseEvent | TouchEvent} $event - The mouse or touch event triggered by the user.
   * @return {void} This method does not return a value.
   */
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  mousemove($event: MouseEvent | TouchEvent) {
    if (this.isDown) {
      const newMousePosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
      this.postboy.fire(new MoveBrushBorderCommand(newMousePosition - this.mouseDownPosition, this.side));
      this.mouseDownPosition = newMousePosition;
    }
  }
}
