import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { FilterDatasetQuery } from '../../../messages/queries/filter-dataset.query';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

@Component({
  selector: 'art-chart-bar',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  protected _settings: ChartBarSettings = new ChartBarSettings();
  private _dataFiltered!: ChartDataModel[];

  constructor(postboy: ChartPostboyService, service: ChartPlateService, private mapService: SettingsMapService) {
    super(postboy, service);
  }

  private _data!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected updateFilteredData(): void {
    const query = new FilterDatasetQuery(this._data);
    this._dataFiltered = this.postboy.execute(query);
  }

  protected getDataset = () => [this.mapService.batDataset(this._settings, this._dataFiltered)];
}
