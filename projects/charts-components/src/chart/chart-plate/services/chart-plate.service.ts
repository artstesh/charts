import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { ChartDataset, ScaleOptionsByType } from 'chart.js';

@Injectable()
export class ChartPlateService {
  chartInitialized = new EventEmitter();
  private _updateTrigger$ = new Subject<boolean>();
  public updateTrigger$ = this._updateTrigger$.pipe(auditTime(250));
  private chart?: Chart;

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

  removeDataset(name: string, order: number, alsoDelete?: string): void {
    if (!this.chart?.data?.datasets?.length) return;
    const initialLength = this.chart.data.datasets.length;
    this.chart.data.datasets = this.chart.data.datasets.filter((d) => d.label != name || d.order !== order);
    if (alsoDelete) {
      this.chart.data.datasets = this.chart.data.datasets.filter((d) => d.label !== alsoDelete);
    }
    if (this.chart.data.datasets.length !== initialLength) this.updateChart(true);
  }

  public setScale(id: string, scale: ScaleOptionsByType): void {
    if (!this.chart?.options?.scales) return;
    this.chart.options.scales[id] = scale;
    this.updateChart();
  }

  public resetScale(id: string): void {
    if (!this.chart?.options?.scales) return;
    this.chart.options.scales[id] = {};
    this.updateChart();
  }
}
