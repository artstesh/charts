import { Injectable } from '@angular/core';
import { BrushRangeModel } from '../models/brush-range.model';
import { IPostboyDependingService } from '@artstesh/postboy';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';

@Injectable()
export class ChartBrushService implements IPostboyDependingService {
  private selectedArea: BrushRangeModel = { left: 0, width: 0 };
  private get maxWidth() {
    return this.mainChart?.canvas.width ?? 0;
  }
  private minWidth = 100;
  mainChart?: Chart;

  constructor(private postboy: InnerPostboyService) {}

  up(): void {
    this.observeParentChart();
    this.observeAreaEvent();
    this.observeMoveBorder();
    this.observeZoomArea();
    this.observeMoveCommand();
  }

  private observeParentChart() {
    return this.postboy.sub<ChartInitializedEvent>(ChartInitializedEvent).subscribe((ev) => {
      this.mainChart = ev.chart;
      this.selectedArea = { left: 0, width: ev.chart.width };
    });
  }

  observeZoomArea(): void {
    this.postboy.sub<ZoomAreaCommand>(ZoomAreaCommand).subscribe((ev) => {
      const area = {
        left: this.selectedArea.left - ev.range / 2,
        width: this.selectedArea.width + ev.range,
      };
      if (area.width + area.left > this.maxWidth) area.width = this.maxWidth - area.left;
      this.updateArea(area);
    });
  }

  private observeAreaEvent(): void {
    this.postboy.sub(BrushAreaEvent).subscribe((ev) => {
      this.selectedArea = ev.range;
    });
  }

  private observeMoveCommand(): void {
    this.postboy.sub(MoveBrushCommand).subscribe((ev) => {
      this.updateArea({ ...this.selectedArea, left: this.selectedArea.left + ev.shift });
    });
  }

  private observeMoveBorder(): void {
    this.postboy.sub(MoveBrushBorderCommand).subscribe((ev) => {
      const area =
        ev.side === 'right'
          ? { ...this.selectedArea, width: this.selectedArea.width + ev.shift }
          : { width: this.selectedArea.width - ev.shift, left: this.selectedArea.left + ev.shift };
      if (area.left < 0) area.width += area.left;
      this.updateArea(area);
    });
  }

  private updateArea(area: BrushRangeModel): void {
    this.postboy.fire(new BrushAreaEvent(this.applyRulesToArea(area)));
  }

  private applyRulesToArea(area: BrushRangeModel): BrushRangeModel {
    if (area.left < 0) area.left = 0;
    if (area.left + area.width > this.maxWidth || area.width < this.minWidth) return this.selectedArea;
    return { ...area };
  }
}
