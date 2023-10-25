import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { ChartDataModel } from '../../../models';
import { ChartService } from '../../../services';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateDatasetFactory } from '../../models/chart-plate-dataset.factory';
import { ChartLineDatasetFactory } from '../../models/chart-line-dataset.factory';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from "../../../services/settings-map.service";

@Component({
  selector: 'chart-line',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent extends AbstractChartTypeComponent<ChartLineSettings> {
  private _data!: ChartDataModel[];
  private _dataFiltered!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  constructor(
    chartService: ChartService,
    limitService: ChartAxisLimitService,
    service: ChartPlateService,
    mapService: SettingsMapService
  ) {
    super(chartService, limitService, service, mapService, new ChartLineSettings());
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected getDataset = () => this.mapService.lineDataset(this._settings, this._dataFiltered);
}
