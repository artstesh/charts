import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartLineSettings } from "../line-chart/chart-line.settings";

@Component({
  selector: 'chart-bar',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  private _data!: ChartDataModel[];
  private _dataFiltered!: ChartDataModel[];
  protected _settings: ChartBarSettings = new ChartBarSettings();

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

  protected getDataset = () => this.mapService.batDataset(this._settings, this._dataFiltered);
}
