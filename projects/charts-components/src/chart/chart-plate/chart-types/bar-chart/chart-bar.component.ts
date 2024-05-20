import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

@Component({
  selector: 'art-chart-bar',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  protected _settings: ChartBarSettings = new ChartBarSettings();

  constructor(postboy: ChartPostboyService, service: ChartPlateService, private mapService: SettingsMapService) {
    super(postboy, service);
  }

  private _data!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected getDataset = () => [this.mapService.batDataset(this._settings, this._data)];
}
