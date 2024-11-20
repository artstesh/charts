import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataModel } from '../../../models';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

@Component({
  selector: 'art-chart-line',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent extends AbstractChartTypeComponent<ChartLineSettings> {
  protected _settings: ChartLineSettings = new ChartLineSettings();

  constructor(postboy: InnerPostboyService, service: ChartPlateService, private mapService: SettingsMapService) {
    super(postboy, service);
  }

  private _data!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.postboy.fire(new ChartDataEvent(this._data));
    this.dataUpdated();
  }

  protected getDataset = () => [this.mapService.lineDataset(this._settings, this._data)];
}
