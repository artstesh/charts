import { Component, OnInit } from '@angular/core';
import { BrushRegistratorService } from './services/brush-registrator.service';
import { DestructibleComponent } from '../common/destructible.component';
import { ChartBrushService } from './services/chart-brush.service';
import { BrushParentService } from './services/brush-parent.service';
import { BrushChartCloneComponent } from './components/brush-chart-clone/brush-chart-clone.component';
import { BrushSelectionAreaComponent } from './components/brush-selection-area/brush-selection-area.component';

/**
 * ChartBrushComponent is a UI component responsible for providing brush-related functionalities
 * within a charting application. It extends DestructibleComponent to incorporate lifecycle management.
 * This component works as a standalone Angular component and uses several services to manage its behavior.
 *
 * Dependencies provided:
 * - BrushRegistratorService: Handles the registration of brush instances.
 * - ChartBrushService: Manages chart-specific brush operations (injected implicitly by the parent service layer).
 * - BrushParentService: Facilitates communication between the brush component and its parent context.
 *
 * This component is tied to a template and style definitions for UI rendering and uses the Angular
 * life-cycle hooks for initialization and cleanup:
 *
 * - `ngOnInit`: Invoked during initialization to configure or prepare the component.
 * - `onDestroy`: Custom lifecycle method provided by DestructibleComponent to release resources by
 *   calling `registrator.down()` when the component is destroyed.
 *
 * It leverages the BrushRegistratorService to maintain lifecycle states, invoking `up` during construction
 * and `down` during destructor logic.
 */
@Component({
  selector: 'art-chart-brush',
  standalone: true,
  templateUrl: './chart-brush.component.html',
  styleUrls: ['./chart-brush.component.scss'],
  providers: [BrushRegistratorService, ChartBrushService, BrushParentService],
  imports: [BrushChartCloneComponent, BrushSelectionAreaComponent],
})
export class ChartBrushComponent extends DestructibleComponent implements OnInit {
  /**
   * Initializes a new instance of the class and performs the necessary setup with the given BrushRegistratorService.
   *
   * @param {BrushRegistratorService} registrator - The service responsible for managing brush registration.
   * @return {void}
   */
  constructor(private registrator: BrushRegistratorService) {
    super();
    this.registrator.up();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * This method is used for component initialization tasks such as fetching data or setting up subscriptions.
   *
   * @return {void} No return value.
   */
  ngOnInit(): void {}

  /**
   * A function that is executed to clean up or tear down resources
   * when a component or service is being destroyed.
   *
   * This method invokes the `down` function on the `registrator` instance
   * to handle cleanup tasks such as unregistering resources or listeners.
   */
  onDestroy = () => {
    this.registrator.down();
  };
}
