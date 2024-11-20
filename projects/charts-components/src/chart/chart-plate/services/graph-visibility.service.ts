import { Injectable } from '@angular/core';
import { IPostboyDependingService } from '@artstesh/postboy';
import Chart from 'chart.js/auto';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { IChartDataset } from '../chart-types/models/i-chart-dataset';
import { ChartUpdateCommand } from '../../messages/commands/chart-update.command';
import { ToggleGraphVisibilityCommand } from '../../messages/commands/toggle-graph-visibility.command';

@Injectable()
export class GraphVisibilityService implements IPostboyDependingService {
  private chart?: Chart;

  constructor(private postboy: InnerPostboyService) {}

  up(): void {
    this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe((ev) => {
      this.chart = ev.chart;
    });
    this.postboy
      .subscribe<ToggleGraphVisibilityCommand>(ToggleGraphVisibilityCommand.ID)
      .subscribe((cmd) => this.toggle(cmd));
  }

  private toggle(cmd: ToggleGraphVisibilityCommand): void {
    if (!this.chart?.data?.datasets) return;
    const datasetIndex = this.chart.data.datasets.findIndex((d) => (d as IChartDataset).id === cmd.graphId);
    if (datasetIndex === -1) return;
    this.chart.data.datasets[datasetIndex].hidden = !cmd.visible;
    this.updateChart();
  }

  private updateChart(force = false): void {
    this.postboy.fire(new ChartUpdateCommand(force));
  }
}
