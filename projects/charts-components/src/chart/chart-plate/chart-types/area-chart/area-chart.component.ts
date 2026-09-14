import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartAreaDataModel } from '../../../models';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { AreaChartSettings } from './area-chart.settings';
import { BuildAreaChartExecutor } from '../../../messages/executors/build-area-chart.executor';
import { GetGradientExecutor } from '../../../messages/executors/get-gradient.executor';
import { first } from 'rxjs/operators';
import { AreaBuilderModel } from '../models/area-builder.model';
import { ChartRenderedEvent } from '../../../messages/events/chart-rendered.event';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

/**
 * AreaChartComponent is responsible for rendering an area chart based on provided settings and data.
 * This component extends the AbstractChartTypeComponent and integrates with chart services.
 *
 * Dependencies:
 * - InnerPostboyService: For event and data communication.
 * - ChartPlateService: For handling chart-related services.
 *
 * Key Features:
 * - Handles area chart-specific settings and data.
 * - Renders area chart datasets dynamically based on data input.
 * - Utilizes event-driven mechanisms to update and validate chart rendering.
 *
 * Properties:
 * - _settings: Internal configuration for the area chart.
 * - _data: Internal representation of the chart data input.
 * - allowed: Boolean flag indicating if the chart is ready to render.
 * - initial: Lifecycle method to manage subscriptions during component initialization.
 * - getDataset: Retrieves and processes the dataset required for rendering the area chart.
 *
 * Lifecycle:
 * - Subscribes to the `ChartRenderedEvent` to ensure the chart is ready before updating.
 * - Triggers updates when the chart data changes or new data is input.
 *
 * Data Handling:
 * Use the `data` input property to provide a ChartAreaDataModel array.
 * This triggers a chart update and processes the new data for rendering.
 */
@Component({
  selector: 'art-area-chart',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent extends AbstractChartTypeComponent<AreaChartSettings> {
  protected _settings: AreaChartSettings = new AreaChartSettings();
  private allowed = false;

  /**
   * Creates an instance of the class and initializes it with the provided services.
   *
   * @param {InnerPostboyService} postboy - The inner service responsible for handling post operations.
   * @param {ChartPlateService} service - The service managing chart-related functionality.
   * @return {void}
   */
  constructor(postboy: InnerPostboyService, service: ChartPlateService) {
    super(postboy, service);
  }

  /**
   * Represents the data for the chart area.
   *
   * This variable holds an array of ChartAreaDataModel objects,
   * which contain the necessary information to define and render
   * a specific chart area.
   *
   * The structure and properties of ChartAreaDataModel provide
   * a blueprint for what constitutes valid data for the chart.
   */
  private _data!: ChartAreaDataModel[];

  /**
   * Sets the data for the chart and triggers relevant update events.
   *
   * @param {ChartAreaDataModel[]} aw - An array of chart area data models to update the chart with.
   */
  @Input() set data(aw: ChartAreaDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  /**
   * Initializes a subscription to the ChartRenderedEvent.
   *
   * This method subscribes to the ChartRenderedEvent using the `postboy.sub` method.
   * The subscription listens for the first occurrence of the event and triggers
   * a callback that sets the `allowed` property to true and calls the `dataUpdated` method.
   *
   * The subscription is added to the `subs` array to manage its lifecycle.
   */
  protected initial = () => {
    this.subs.push(
      this.postboy
        .sub<ChartRenderedEvent>(ChartRenderedEvent)
        .pipe(first())
        .subscribe((ev) => {
          this.allowed = true;
          this.dataUpdated();
        }),
    );
  };

  /**
   * Retrieves the dataset for the chart based on the current settings, chart configuration,
   * and processed gradient data. Executes a series of operations to construct and return
   * the top and bottom sections of the dataset.
   *
   * @returns {Array} An array containing the top and bottom sections of the dataset.
   *                  Returns an empty array if the chart is not initialized or not allowed.
   */
  protected getDataset = () => {
    if (!this.chart || !this.allowed) return [];
    let content = this.postboy.exec<AreaBuilderModel>(
      new BuildAreaChartExecutor(
        this._settings,
        this._data,
        this.postboy.exec(
          new GetGradientExecutor(this.chart ?? null, this._settings.colors, this._settings.direction),
        )!,
      ),
    );
    this.alsoDelete = () => content.bottom?.id;
    return [content.top, content.bottom];
  };
}
