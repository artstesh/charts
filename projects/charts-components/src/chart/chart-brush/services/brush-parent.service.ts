import { Injectable } from '@angular/core';
import { IPostboyDependingService } from '@artstesh/postboy';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { ChartDataEvent } from '../../messages/events/chart-data.event';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';
import { ChartScrollEvent } from '../../messages/events/chart-scroll.event';
import { ResetBrushCommand } from '../messages/commands/reset-brush.command';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { ChartConstants } from '../../models/chart-constants';

@Injectable()
export class BrushParentService implements IPostboyDependingService {
  minValue?: number;
  maxValue?: number;
  mainChart?: Chart;

  constructor(private postboy: ChartPostboyService) {}

  up(): void {
    this.observeParentChart();
    this.observeParentData();
    this.observeSelectedArea();
    this.observeResetBrush();
  }

  private observeResetBrush() {
    this.postboy
      .subscribe<ResetBrushCommand>(ResetBrushCommand.ID)
      .subscribe(() => this.postboy.fire(new BrushAreaEvent({ left: 0, width: this.mainChart?.canvas.width ?? 0 })));
  }

  private observeParentChart() {
    return this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe((ev) => {
      this.mainChart = ev.chart;
      this.mainChart.canvas.addEventListener('wheel', (ev) => this.onMouseScroll(ev, ev.deltaY < 0 ? 'up' : 'down'));
      const obs = new ResizeObserver(() => this.postboy.fire(new ResetBrushCommand()));
      obs.observe(this.mainChart.canvas);
    });
  }

  observeParentData(): void {
    this.postboy.subscribe<ChartDataEvent>(ChartDataEvent.ID).subscribe((ev) => {
      if (!ev.data?.length) return;
      let min = ev.data[0].x;
      let max = ev.data[ev.data.length - 1].x;
      if (!this.minValue || this.minValue > min) this.minValue = min;
      if (!this.maxValue || this.maxValue < max) this.maxValue = max;
    });
  }

  private observeSelectedArea(): void {
    this.postboy.subscribe<BrushAreaEvent>(BrushAreaEvent.ID).subscribe((ev) => {
      if (!this.mainChart || this.minValue == null || this.maxValue == null) return;
      const range = this.maxValue - this.minValue;
      let xAxis = this.mainChart.options.scales![ChartConstants.BottomAxisId] as any;
      xAxis.min = this.minValue + (ev.range.left === 0 ? 0 : (range * ev.range.left) / this.mainChart.canvas.width);
      xAxis.max = this.minValue + (range * (ev.range.left + ev.range.width)) / this.mainChart.canvas.width;
      this.mainChart.update();
    });
  }

  private onMouseScroll(ev: WheelEvent, direction: 'up' | 'down'): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.postboy.fire(new ChartScrollEvent(direction));
  }
}
