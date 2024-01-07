import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { FilterDatasetQuery } from '../../../messages/queries/filter-dataset.query';

@Component({
  selector: 'chart-bar',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  protected _settings: ChartBarSettings = new ChartBarSettings();
  private _dataFiltered!: ChartDataModel[];

  constructor(postboy: ChartPostboyService, service: ChartPlateService, mapService: SettingsMapService) {
    super(postboy, service, mapService);
  }

  private _data!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  protected updateFilteredData(): void {
    const query = new FilterDatasetQuery(this._data);
    query.result.subscribe((r) => (this._dataFiltered = r));
    this.postboy.fire(query);
  }

  protected getDataset = () => this.mapService.batDataset(this._settings, this._dataFiltered);
}
