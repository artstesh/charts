import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { ChartDataModel } from '../../../models';
import { ScatterChartSettings } from './scatter-chart.settings';
import { BuildScatterChartExecutor } from '../../../messages/executors/build-scatter-chart.executor';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

/**
 * ScatterChartComponent is a specialized Angular component for rendering scatter charts.
 * It extends the AbstractChartTypeComponent with specific settings defined in ScatterChartSettings.
 */
@Component({
  selector: 'art-scatter-chart',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterChartComponent extends AbstractChartTypeComponent<ScatterChartSettings> {
  protected _settings: ScatterChartSettings = new ScatterChartSettings();

  /**
   * Constructs an instance of the class with the provided services.
   *
   * @param {InnerPostboyService} postboy - An instance of the InnerPostboyService to handle internal operations.
   * @param {ChartPlateService} service - An instance of the ChartPlateService to manage chart-related operations.
   * @return {void} This constructor does not explicitly return anything.
   */
  constructor(postboy: InnerPostboyService, service: ChartPlateService) {
    super(postboy, service);
  }

  private _data!: ChartDataModel[];

  /**
   * Sets the chart data and triggers necessary updates.
   *
   * @param {ChartDataModel[]} aw - An array of data models representing the chart data.
   */
  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected getDataset = () => [this.postboy.exec(new BuildScatterChartExecutor(this._settings, this._data))];
}
