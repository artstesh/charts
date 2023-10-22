import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { ChartDataModel } from '../../../models';
import { ChartService } from '../../../services';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartLineSettings } from './chart-line.settings';
import { ChartPlateDatasetModel } from '../../models/chart-plate-dataset.model';
import { ChartLineDatasetModel } from '../../models/chart-line-dataset.model';
import { ChartPlateService } from '../../services/chart-plate.service';

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
  ) {
    super(chartService, limitService, service, new ChartLineSettings());
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected addDataset(): void {
    const model = new ChartLineDatasetModel(this._settings.name, this._dataFiltered)
      .backColor(this._settings.color)
      .order(this._settings.order)
      .pointRadius(this._settings.pointRadius)
      .borderColor(this._settings.color);
    this.service.addDataset(model.build());
  }
}
