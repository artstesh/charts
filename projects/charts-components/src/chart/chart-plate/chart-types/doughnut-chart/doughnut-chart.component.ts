import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RadialDataModel } from '../../../models';
import { ChartPlateService } from '../../services/chart-plate.service';
import { DoughnutChartSettings } from './doughnut-chart.settings';
import { DestructibleComponent } from '../../../common/destructible.component';
import { DoughnutChartFactory } from './doughnut-chart.factory';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';

/**
 * DoughnutChartComponent is a UI component responsible for rendering a doughnut chart
 * based on the provided configuration and data. It is a standalone Angular component
 * with OnPush change detection strategy to optimize performance.
 *
 * This class extends DestructibleComponent and implements the OnInit lifecycle hook
 * to manage subscriptions and handle initialization logic.
 */
@Component({
  selector: 'art-doughnut-chart',
  standalone: true,
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent extends DestructibleComponent implements OnInit {
  /**
   * Constructs a new instance of the class.
   *
   * @param {ChartPlateService} service - The service responsible for managing chart plates.
   * @param {InnerPostboyService} postboy - The service used for handling internal communication.
   * @param {DoughnutChartFactory} factory - The factory for creating instances of doughnut charts.
   * @return {void} Does not return a value.
   */
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private factory: DoughnutChartFactory,
  ) {
    super();
  }

  /**
   * Holds the configuration settings for a doughnut chart.
   * This includes properties and parameters used to customize
   * the appearance and behavior of the chart.
   *
   * The `_settings` variable is an instance of `DoughnutChartSettings`,
   * which provides options for chart customization such as data,
   * colors, labels, animations, and other visual or functional properties.
   *
   * This variable is typically used to define chart configurations
   * before rendering the chart.
   */
  protected _settings: DoughnutChartSettings = new DoughnutChartSettings();

  /**
   * Sets the settings for the doughnut chart and triggers an update if the new value differs from the current one.
   *
   * @param {DoughnutChartSettings | undefined} value - The new settings to be applied to the doughnut chart. If undefined or the same as the current settings, no update is performed.
   */
  @Input() set settings(value: DoughnutChartSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.dataUpdated();
  }

  /**
   * A collection of radial data models utilized to represent complex data structures
   * in a radial or circular format. This array is initialized as empty but is intended
   * to store instances of RadialDataModel.
   *
   * Each element of the array adheres to the RadialDataModel structure, ensuring
   * consistency and providing a predictable data format for operations that rely on it.
   */
  private _data: RadialDataModel[] = [];

  /**
   * Sets the radial data model and triggers the data update process.
   *
   * @param {RadialDataModel[]} aw - The array of radial data models to be assigned. If null or undefined, assigns an empty array.
   */
  @Input() set data(aw: RadialDataModel[]) {
    this._data = aw ?? [];
    this.dataUpdated();
  }

  /**
   * Lifecycle hook that is called after Angular has finished initializing the component.
   * Subscribes to the ChartInitializedEvent and invokes the `dataUpdated` method when the event is triggered.
   *
   * @return {void} No value is returned by this method.
   */
  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.dataUpdated()));
  }

  /**
   * A callback function executed during the destruction process of a component or service.
   * This function is responsible for performing cleanup tasks by removing a dataset associated with the given settings ID.
   *
   * @function
   */
  onDestroy = () => {
    this.service.removeDataset(this._settings.id);
  };

  /**
   * Updates the underlying data within the service by removing the current dataset,
   * resetting the scale, adding the new dataset, and updating the labels.
   *
   * @return {void} Does not return a value.
   */
  protected dataUpdated(): void {
    this.service.removeDataset(this._settings.id);
    this.service.resetScale();
    this.service.addDataset(this.getDataset() as any);
    this.service.setLabels(this._data.map((d) => d.label));
  }

  protected getDataset = () => this.factory.build(this._settings, this._data);
}
