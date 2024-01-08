import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartDataset, LegendOptions, ScaleOptionsByType } from 'chart.js';
import { IChartDataset } from '../chart-types/models/i-chart-dataset';
import { IPostboyDependingService } from '@artstesh/postboy';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';

@Injectable()
export class ChartPlateService implements IPostboyDependingService {
  private chart?: Chart;

  constructor(private postboy: ChartPostboyService) {}

  up(): void {
    this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe((ev) => {
      this.chart = ev.chart;
    });
  }

  private updateChart(force = false): void {
    this.postboy.fire(new ChartUpdateCommand(force));
  }

  addDataset(dataset: ChartDataset): void {
    if (!this.chart?.data) return;
    this.chart.data.datasets.push(dataset);
    this.updateChart();
  }

  removeDataset(id: string, alsoDelete?: string): void {
    if (!this.chart?.data?.datasets?.length) return;
    const initialLength = this.chart.data.datasets.length;
    this.chart.data.datasets = this.chart.data.datasets.filter((d) => (d as IChartDataset).id !== id);
    if (alsoDelete) {
      this.chart.data.datasets = this.chart.data.datasets.filter((d) => (d as IChartDataset).id !== alsoDelete);
    }
    if (this.chart.data.datasets.length !== initialLength) this.updateChart(true);
    else this.updateChart();
  }

  public setScale(id: string, scale: ScaleOptionsByType): void {
    if (!this.chart?.options?.scales) return;
    this.chart.options.scales[id] = scale;
    this.updateChart();
  }

  public resetScale(id?: string): void {
    if (!this.chart?.options?.scales) return;
    if (!!id) this.chart.options.scales[id] = {};
    else this.chart.options.scales = {};
    this.updateChart();
  }

  public setLegend(options: LegendOptions<any>): void {
    if (!this.chart?.options?.plugins) return;
    this.chart.options.plugins.legend = options;
    this.updateChart();
  }

  public setLabels(value: string[]): void {
    if (!this.chart?.data) return;
    this.chart.data.labels = value;
    this.updateChart();
  }

  public setTooltip(v: any): void {
    if (!this.chart?.options?.plugins) return;
    this.chart.options.plugins.tooltip = v;
    this.updateChart();
  }
}
