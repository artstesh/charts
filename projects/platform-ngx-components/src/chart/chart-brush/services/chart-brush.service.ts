import { ElementRef, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import Chart from 'chart.js/auto';
import { SelectedAreaModel } from '../models/selected-area.model';

@Injectable()
export class ChartBrushService {
   parentChart$ = new ReplaySubject<Chart>(1);
   SelectedArea$ = new ReplaySubject<SelectedAreaModel>(1);
   parentChartRange$ = new ReplaySubject<{ min?: Date; max?: Date }>(1);
   parentChart?: Chart;
   private selectedArea: SelectedAreaModel = { left: 0, width: 0 };
   private maxWidth = 0;
   private minWidth = 0;

   constructor() {}

   setParent(chart: Chart): void {
      this.parentChart = chart;
      this.parentChart$.next(chart);
   }

   setWidthRestrictions(max: number, min = 100): void {
      this.maxWidth = max;
      this.minWidth = min;
      this.updateArea({ left: 0, width: max });
   }

   moveArea(shift: number): void {
      this.updateArea({ ...this.selectedArea, left: this.selectedArea.left + shift });
   }

   moveBorder(shift: number, side: 'left' | 'right'): void {
      const area =
         side === 'right'
            ? { ...this.selectedArea, width: this.selectedArea.width + shift }
            : { width: this.selectedArea.width - shift, left: this.selectedArea.left + shift };
      if (area.left < 0) area.width += area.left;
      this.updateArea(area);
   }

   zoomArea(range: number): void {
      const area = { left: this.selectedArea.left - range / 2, width: this.selectedArea.width + range };
      if (area.width + area.left > this.maxWidth) area.width = this.maxWidth - area.left;
      this.updateArea(area);
   }

   private updateArea(area: SelectedAreaModel): void {
      this.selectedArea = this.applyRulesToArea(area);
      this.SelectedArea$.next({ ...this.selectedArea });
   }

   private applyRulesToArea(area: SelectedAreaModel): SelectedAreaModel {
      if (area.left < 0) area.left = 0;
      if (area.left + area.width > this.maxWidth || area.width < this.minWidth) return this.selectedArea;
      return { ...area };
   }
}
