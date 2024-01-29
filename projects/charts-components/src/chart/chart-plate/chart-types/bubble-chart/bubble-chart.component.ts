import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { FilterDatasetQuery } from '../../../messages/queries/filter-dataset.query';
import { BubbleChartSettings } from './bubble-chart.settings';
import { BuildBubbleChartExecutor } from '../../../messages/executors/build-bubble-chart.executor';
import { BubbleDataModel } from '../../../models';

@Component({
  selector: 'art-bubble-chart',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent extends AbstractChartTypeComponent<BubbleChartSettings> {
  protected _settings: BubbleChartSettings = new BubbleChartSettings();
  private _dataFiltered!: BubbleDataModel[];

  constructor(postboy: ChartPostboyService, service: ChartPlateService) {
    super(postboy, service);
  }

  private _data!: BubbleDataModel[];

  @Input() set data(aw: BubbleDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  protected updateFilteredData(): void {
    const query = new FilterDatasetQuery(this._data);
    this._dataFiltered = this.postboy.execute(query);
  }

  protected getDataset = () => [this.postboy.execute(new BuildBubbleChartExecutor(this._settings, this._dataFiltered))];
}
