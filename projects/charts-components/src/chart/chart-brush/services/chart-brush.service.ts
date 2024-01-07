import { Injectable } from '@angular/core';
import { BrushRangeModel } from '../models/brush-range.model';
import { IPostboyDependingService } from '@artstesh/postboy';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { WidthRestrictionsCommand } from '../messages/commands/width-restrictions.command';

@Injectable()
export class ChartBrushService implements IPostboyDependingService {
  private selectedArea: BrushRangeModel = { left: 0, width: 0 };
  private maxWidth = 0;
  private minWidth = 0;

  constructor(private postboy: ChartPostboyService) {}

  up(): void {
    this.observeAreaEvent();
    this.observeMoveBorder();
    this.observeZoomArea();
    this.observeMoveCommand();
    this.observeWidthRestrictions();
  }

  observeZoomArea(): void {
    this.postboy.subscribe<ZoomAreaCommand>(ZoomAreaCommand.ID).subscribe((ev) => {
      const area = { left: this.selectedArea.left - ev.range / 2, width: this.selectedArea.width + ev.range };
      if (area.width + area.left > this.maxWidth) area.width = this.maxWidth - area.left;
      this.updateArea(area);
    });
  }

  private observeAreaEvent(): void {
    this.postboy.subscribe<BrushAreaEvent>(BrushAreaEvent.ID).subscribe((ev) => {
      this.selectedArea = ev.range;
    });
  }

  private observeWidthRestrictions(): void {
    this.postboy.subscribe<WidthRestrictionsCommand>(WidthRestrictionsCommand.ID).subscribe((ev) => {
      this.maxWidth = ev.max;
      this.minWidth = ev.min;
      this.updateArea({ left: 0, width: ev.max });
    });
  }

  private observeMoveCommand(): void {
    this.postboy.subscribe<MoveBrushCommand>(MoveBrushCommand.ID).subscribe((ev) => {
      this.updateArea({ ...this.selectedArea, left: this.selectedArea.left + ev.shift });
    });
  }

  private observeMoveBorder(): void {
    this.postboy.subscribe<MoveBrushBorderCommand>(MoveBrushBorderCommand.ID).subscribe((ev) => {
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
