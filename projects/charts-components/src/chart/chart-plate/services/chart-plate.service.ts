import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartDataset, LegendOptions, ScaleOptionsByType } from 'chart.js';
import { IChartDataset } from '../chart-types/models/i-chart-dataset';
import { IPostboyDependingService } from '@artstesh/postboy';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';

@Injectable()
export class ChartPlateService implements IPostboyDependingService {
  private _chart?: Chart;

  constructor(private postboy: InnerPostboyService) {}

  /**
   * The underlying Chart.js instance of the chart plate. It is undefined until the
   * plate has rendered (see ChartInitializedEvent and ChartRenderedEvent).
   */
  public get chart(): Chart | undefined {
    return this._chart;
  }

  /**
   * Returns the rendered chart as a base64 data URL, delegating to Chart.js'
   * `toBase64Image`. Returns undefined while no chart is rendered. The snapshot
   * reflects the current canvas, so for a complete picture call it after the
   * render has finished (e.g. upon ChartRenderedEvent).
   */
  public toBase64Image(type = 'image/png', quality = 1): string | undefined {
    return this._chart?.toBase64Image(type, quality);
  }

  up(): void {
    this.postboy.sub(ChartInitializedEvent).subscribe((ev) => {
      this._chart = ev.chart;
    });
  }

  removeDataset(id: string, alsoDelete?: string): void {
    if (!this._chart?.data?.datasets?.length) return;
    const initialLength = this._chart.data.datasets.length;
    this._chart.data.datasets = this._chart.data.datasets.filter((d) => (d as IChartDataset).id !== id);
    if (alsoDelete) {
      this._chart.data.datasets = this._chart.data.datasets.filter((d) => (d as IChartDataset).id !== alsoDelete);
    }
    if (this._chart.data.datasets.length !== initialLength) this.updateChart(true);
    else this.updateChart();
  }

  addDataset(dataset: ChartDataset): void {
    if (!this._chart?.data || !dataset) return;
    this._chart.data.datasets.push(dataset);
    this.updateChart();
  }

  private updateChart(force = false): void {
    this.postboy.fire(new ChartUpdateCommand(force));
  }

  public setScale(id: string, scale: ScaleOptionsByType): void {
    if (!this._chart?.options?.scales) return;
    this._chart.options.scales[id] = scale;
    this.updateChart();
  }

  public resetScale(id?: string): void {
    if (!this._chart?.options?.scales) return;
    if (!!id) this._chart.options.scales[id] = {};
    else this._chart.options.scales = {};
    this.updateChart();
  }

  public setLegend(options: LegendOptions<any>): void {
    if (!this._chart?.options?.plugins) return;
    this._chart.options.plugins.legend = options;
    this.updateChart();
  }

  public setLabels(value: string[]): void {
    if (!this._chart?.data) return;
    this._chart.data.labels = value;
    this.updateChart();
  }

  public setTooltip(v: any): void {
    if (!this._chart?.options?.plugins) return;
    this._chart.options.plugins.tooltip = v;
    this.updateChart();
  }
}
