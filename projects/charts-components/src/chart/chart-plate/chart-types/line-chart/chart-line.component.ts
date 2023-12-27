import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from "../../../services/chart-postboy.service";

@Component({
  selector: 'chart-line',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent extends AbstractChartTypeComponent<ChartLineSettings> {
  protected _settings: ChartLineSettings = new ChartLineSettings();
  private _dataFiltered!: ChartDataModel[];

  constructor(limitService: ChartAxisLimitService,
              postboy: ChartPostboyService,service: ChartPlateService, mapService: SettingsMapService) {
    super(limitService, postboy, service, mapService);
  }

  private _data!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected getDataset = () => this.mapService.lineDataset(this._settings, this._dataFiltered);
}
