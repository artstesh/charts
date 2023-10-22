import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { ChartDataModel } from '../../../models';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartService } from '../../../services';
import { ChartLineSettings } from '../line-chart/chart-line.settings';
import { ChartBarSettings } from './chart-bar.settings';
import { ChartBarDatasetModel } from '../../models/chart-bar-dataset.model';
import { ChartPlateService } from '../../services/chart-plate.service';

@Component({
  selector: 'chart-bar',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent extends AbstractChartTypeComponent<ChartBarSettings> {
  private _data!: ChartDataModel[];
  private _dataFiltered!: ChartDataModel[];

  @Input() set data(aw: ChartDataModel[]) {
    this._data = aw;
    this.dataUpdated();
  }

  yAxisId = 'y';

  constructor(
    chartService: ChartService,
    limitService: ChartAxisLimitService,
    service: ChartPlateService,
  ) {
    super(chartService, limitService, service, new ChartBarSettings());
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected addDataset(): void {
    const model = new ChartBarDatasetModel(this._settings.name, this._dataFiltered)
      .order(this._settings.order)
      .backColor(this._settings.color)
      .thickness(this._settings.thickness);
    this.service.addDataset(model.build());
  }
}
