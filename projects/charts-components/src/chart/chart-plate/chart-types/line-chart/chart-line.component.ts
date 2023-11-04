import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';

@Component({
  selector: 'chart-line',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent extends AbstractChartTypeComponent<ChartLineSettings> {
  private _data!: ChartDataModel[];
  private _dataFiltered!: ChartDataModel[];
  protected _settings: ChartLineSettings = new ChartLineSettings();

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  constructor(limitService: ChartAxisLimitService, service: ChartPlateService, mapService: SettingsMapService) {
    super(limitService, service, mapService);
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected getDataset = () => this.mapService.lineDataset(this._settings, this._dataFiltered);
}
