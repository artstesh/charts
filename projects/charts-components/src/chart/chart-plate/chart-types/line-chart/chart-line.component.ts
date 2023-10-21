import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { ChartDataModel } from '../../../models';
import { ChartService } from '../../../services';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartLineSettings } from './chart-line.settings';

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
  @Input() yAxisId = 'y';
  @Input() enableSegments = true;
  @Input() tooltipShift?: number = 0;

  constructor(parent: ChartPlateComponent, service: ChartService, limitService: ChartAxisLimitService) {
    super(parent, service, limitService, new ChartLineSettings());
  }

  protected updateFilteredData(): void {
    this._dataFiltered = this.limitService.examine(this._data);
  }

  protected addDataset(): void {
    if (!this.parent.chart?.data) return;
    this.parent.chart.data.datasets.push({
      label: this._settings.name,
      type: 'line',
      order: this._settings.order,
      data: this._dataFiltered as any,
      fill: false,
      yAxisID: this.yAxisId,
      backgroundColor: this._settings.color,
      pointRadius: this._settings.pointRadius,
      pointHitRadius: 5,
      borderColor: this._settings.color,
      legendStyle: 'line',
      tooltipShift: this.tooltipShift,
    } as ChartDataset);
    this.updateChart();
  }
}
