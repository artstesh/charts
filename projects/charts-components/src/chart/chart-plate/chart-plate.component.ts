import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectFlags,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { ChartPlateService } from './services/chart-plate.service';
import { SettingsMapService } from '../services/settings-map.service';
import { ChartPlateSettings } from './models/chart-plate.settings';
import { registerAdapter } from '../utils/chart-date.adapter';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../services/inner-postboy.service';
import { InnerMessageRegistrator } from '../services/inner-message-registrator.service';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { ChartAreaType } from './chart-types/models/area.type';
import { ChartPostboyService } from '../services/chart-postboy.service';
import { ExternalMessageRegistrator } from '../services/external-message.registrator';
import { GraphVisibilityService } from './services/graph-visibility.service';

registerAdapter();

/**
 * The ChartPlateComponent is responsible for rendering and managing a chart within the application.
 * This component uses various services to handle chart initialization, updates, and messaging.
 *
 * The ChartPlateComponent is designed to work with a standalone configuration, leveraging Angular's
 * dependency injection system for services and settings.
 *
 * Features:
 * - Dynamically sets up a chart using the Chart.js library.
 * - Monitors and reacts to setting updates.
 * - Utilizes subscriptions to handle real-time message events.
 * - Implements Angular lifecycle hooks to manage resources and interactions efficiently.
 * - Facilitates extensibility for different chart types and configurations.
 *
 * Lifecycle Hooks:
 * - OnInit: Subscribes to events and prepares chart updates.
 * - AfterViewInit: Initializes the chart after the view has been fully loaded.
 * - OnDestroy: Cleans up subscriptions and resources when the component is destroyed.
 *
 * Dependencies:
 * - ChartPostboyService: Handles messaging for chart updates and interactions.
 * - InnerMessageRegistrator: Manages internal message registration.
 * - ExternalMessageRegistrator: Manages external message registration.
 * - SettingsMapService: Provides chart configuration based on settings.
 *
 * Inputs:
 * - settings: Accepts a `ChartPlateSettings` object. Updates the chart configuration when new settings are received.
 */
@Component({
  selector: 'art-chart-plate',
  standalone: true,
  templateUrl: './chart-plate.component.html',
  styleUrls: ['./chart-plate.component.scss'],
  providers: [
    ChartPlateService,
    InnerMessageRegistrator,
    InnerPostboyService,
    GraphVisibilityService,
    ExternalMessageRegistrator,
    {
      provide: ChartPostboyService,
      useFactory: () => {
        const colorService = inject(ChartPostboyService, InjectFlags.Optional | InjectFlags.SkipSelf);
        return colorService || new ChartPostboyService();
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPlateComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chart')
  chartRef!: ElementRef;
  chart!: Chart;
  private subs: Subscription[] = [];

  /**
   * Constructs an instance of the class with required services and initializes necessary components.
   *
   * @param {InnerPostboyService} postboy - A service for managing inner postboy operations.
   * @param {InnerMessageRegistrator} innerRegistrator - Handles the registration of internal messages.
   * @param {ExternalMessageRegistrator} registrator - Manages the registration of external messages.
   * @param {SettingsMapService} mapService - Service for handling settings related to maps.
   * @return {void}
   */
  constructor(
    private postboy: InnerPostboyService,
    private innerRegistrator: InnerMessageRegistrator,
    private registrator: ExternalMessageRegistrator,
    private mapService: SettingsMapService,
  ) {
    Chart.register(ChartAreaType);
    this.innerRegistrator.up();
    this.registrator.up();
  }

  /**
   * Represents the configuration settings for a chart plate,
   * encapsulating properties and behaviors required for managing
   * chart appearance, dimensions, and other customizable options.
   *
   * This variable is an instance of the `ChartPlateSettings` class,
   * which provides a structured way to configure various aspects of
   * a chart's plate, such as layout, styling, and behaviors.
   */
  private _settings: ChartPlateSettings = new ChartPlateSettings();

  /**
   * Sets the chart settings and updates the chart configuration if the provided settings are different.
   * Fires a ChartUpdateCommand event to notify of changes.
   *
   * @param {ChartPlateSettings | undefined} value - The new chart settings to be applied. If undefined or unchanged, the method does nothing.
   */
  @Input() set settings(value: ChartPlateSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    if (!!this.chart?.config) (this.chart.config as any).type = value.type;
    this.postboy.fire(new ChartUpdateCommand());
  }

  /**
   * Lifecycle hook that is called after the component's data-bound properties are initialized.
   * Subscribes to the `ChartUpdateCommand` event and triggers the chart update process
   * when an event is emitted, optionally applying a forced update.
   *
   * @return {void} No return value.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartUpdateCommand).subscribe((ev) => this.updateChart(ev.force)));
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * This method is typically used to perform any additional initialization tasks or to interact
   * with child views, projected content, or other DOM elements.
   *
   * In this implementation, it invokes the `setChart` method to configure or initialize a chart component.
   *
   * @return {void} Does not return a value.
   */
  ngAfterViewInit(): void {
    this.setChart();
  }

  /**
   * Cleanup logic performed when the component or directive is destroyed.
   * This method unsubscribes from all active subscriptions and performs
   * any additional teardown operations required to release resources
   * and prevent memory leaks.
   *
   * @return {void} No return value.
   */
  ngOnDestroy(): void {
    this.innerRegistrator.down();
    this.registrator.down();
    this.subs.forEach((s) => s.unsubscribe());
  }

  /**
   * Initializes and sets up the chart using the provided settings and configuration.
   * Emits a ChartInitializedEvent once the chart has been created and configured.
   *
   * @return {void} This method does not return a value.
   */
  setChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, this.mapService.chartPlateConfig(this._settings, this.postboy));
    this.postboy.fire(new ChartInitializedEvent(this.chart));
  }

  /**
   * Updates the chart by applying any changes to its data or configurations.
   * This method ensures that only valid metadata entries are retained before updating the chart.
   *
   * @param {boolean} [force=false] - If true, forces the chart to update regardless of its current state.
   * @return {void} This method does not return a value.
   */
  updateChart(force = false): void {
    try {
      if (!!(this.chart as any)._metasets)
        (this.chart as any)._metasets = (this.chart as any)._metasets.filter((d: any) => !!d.controller);
      this.chart.update();
    } catch {
      // ignore
    }
  }
}
