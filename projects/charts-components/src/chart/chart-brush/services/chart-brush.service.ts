import { ElementRef, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import Chart from 'chart.js/auto';
import { BrushRangeModel } from "../models/brush-range.model";
import { IPostboyDependingService } from "@artstesh/postboy";
import { ChartPostboyService } from "../../services/chart-postboy.service";
import { MoveBrushBorderCommand } from "../../messages/commands/move-brush-border.command";

@Injectable()
export class ChartBrushService implements IPostboyDependingService {
  SelectedArea$ = new ReplaySubject<BrushRangeModel>(1);
  parentChartRange$ = new ReplaySubject<{ min?: number; max?: number }>(1);
  private selectedArea: BrushRangeModel = { left: 0, width: 0 };
  private maxWidth = 0;
  private minWidth = 0;

  constructor(private postboy: ChartPostboyService) {}

  up(): void {
    this.observeMoveBorder();
  }

  setWidthRestrictions(max: number, min = 100): void {
    this.maxWidth = max;
    this.minWidth = min;
    this.updateArea({ left: 0, width: max });
  }

  moveArea(shift: number): void {
    this.updateArea({ ...this.selectedArea, left: this.selectedArea.left + shift });
  }

  private observeMoveBorder(): void {
    this.postboy.subscribe<MoveBrushBorderCommand>(MoveBrushBorderCommand.ID).subscribe(ev => {
        const area =
          ev.side === 'right'
            ? { ...this.selectedArea, width: this.selectedArea.width + ev.shift }
            : { width: this.selectedArea.width - ev.shift, left: this.selectedArea.left + ev.shift };
        if (area.left < 0) area.width += area.left;
        this.updateArea(area);
      });
  }

  zoomArea(range: number): void {
    const area = { left: this.selectedArea.left - range / 2, width: this.selectedArea.width + range };
    if (area.width + area.left > this.maxWidth) area.width = this.maxWidth - area.left;
    this.updateArea(area);
  }

  private updateArea(area: BrushRangeModel): void {
    this.selectedArea = this.applyRulesToArea(area);
    this.SelectedArea$.next({ ...this.selectedArea });
  }

  private applyRulesToArea(area: BrushRangeModel): BrushRangeModel {
    if (area.left < 0) area.left = 0;
    if (area.left + area.width > this.maxWidth || area.width < this.minWidth) return this.selectedArea;
    return { ...area };
  }
}
