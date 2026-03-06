import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { BubbleChartSettings } from './bubble-chart.settings';
import { BuildBubbleChartExecutor } from '../../../messages/executors/build-bubble-chart.executor';
import { BubbleDataModel } from '../../../models';

/**
 * Represents a bubble chart component that extends the functionality of the AbstractChartTypeComponent.
 * This class is responsible for rendering and handling bubble chart data using the provided settings and services.
 *
 * Component Details:
 * - Selector: 'art-bubble-chart'
 * - Standalone: true
 * - Change Detection: OnPush
 *
 * Dependencies:
 * - Requires `InnerPostboyService` for internal communication and execution mechanisms.
 * - Requires `ChartPlateService` for accessing chart-related utilities and services.
 *
 * Functional Overview:
 * - Accepts a data input of type `BubbleDataModel[]` through the `data` property.
 * - Uses the `BubbleChartSettings` configuration for setting up chart-specific parameters.
 * - Processes data and settings to generate a bubble chart dataset using the `BuildBubbleChartExecutor`.
 *
 * Properties:
 * - `_settings` (protected): Holds the default settings for the bubble chart of type `BubbleChartSettings`.
 * - `_data` (private): Represents the incoming dataset of type `BubbleDataModel[]`.
 *
 * Methods:
 * - `data`: Input setter that updates the `_data` property and triggers data processing via `dataUpdated`.
 * - `getDataset`: A protected method that constructs and returns the dataset for the bubble chart using the postboy service.
 */
@Component({
  selector: 'art-bubble-chart',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent extends AbstractChartTypeComponent<BubbleChartSettings> {
  protected _settings: BubbleChartSettings = new BubbleChartSettings();

  /**
   * Creates an instance of the class.
   *
   * @param {InnerPostboyService} postboy - The service responsible for managing internal postboy operations.
   * @param {ChartPlateService} service - The service used for chart plate operations.
   * @return {void}
   */
  constructor(postboy: InnerPostboyService, service: ChartPlateService) {
    super(postboy, service);
  }

  /**
   * Represents a collection of data items adhering to the `BubbleDataModel` structure.
   * This variable is expected to hold an array of `BubbleDataModel` objects, which can
   * be used for operations requiring structured bubble chart data or similar purposes.
   *
   * @type {BubbleDataModel[]}
   */
  private _data!: BubbleDataModel[];

  /**
   * Sets the input data for the component and triggers an update.
   *
   * @param {BubbleDataModel[]} aw - The array of BubbleDataModel objects to be assigned as the component's data.
   */
  @Input() set data(aw: BubbleDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  protected getDataset = () => [this.postboy.exec(new BuildBubbleChartExecutor(this._settings, this._data))];
}
