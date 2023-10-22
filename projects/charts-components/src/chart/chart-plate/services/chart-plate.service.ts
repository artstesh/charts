import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { ChartDataset } from 'chart.js';

@Injectable()
export class ChartPlateService {
  chartInitialized = new EventEmitter();
  chartUpdated = new EventEmitter();
  private _updateTrigger$ = new Subject<boolean>();
  public updateTrigger$ = this._updateTrigger$.pipe(auditTime(250));
  private chart?: Chart;

  constructor() {}

  public setChart(chart: Chart): void {
    this.chart = chart;
  }

  public updateChart(force = false): void {
    this._updateTrigger$.next(force);
  }

  addDataset(dataset: ChartDataset): void {
    if (!this.chart?.data) return;
    this.chart.data.datasets.push(dataset);
    this.updateChart();
  }

  removeDataset(name: string, order: number, requiredToDelete?: string): void {
    if (!this.chart?.data?.datasets?.length) return;

    this.chart.data.datasets = this.chart.data.datasets.filter((d) => d.label != name || d.order !== order);
    if (requiredToDelete) {
      this.chart.data.datasets = this.chart.data.datasets.filter((d) => d.label !== requiredToDelete);
    }
    this.updateChart(true);
  }
}
