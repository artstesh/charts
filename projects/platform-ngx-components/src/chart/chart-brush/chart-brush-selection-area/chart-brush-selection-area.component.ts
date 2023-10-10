import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { Moment } from 'moment';
import { combineLatest, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectedAreaModel } from '../models/selected-area.model';
import { ChartBrushService } from '../services/chart-brush.service';

@Component({
   selector: 'app-chart-brush-selection-area',
   templateUrl: './chart-brush-selection-area.component.html',
   styleUrls: ['./chart-brush-selection-area.component.scss']
})
export class ChartBrushSelectionAreaComponent implements OnInit, OnDestroy {
   @Input() xAxisName = 'x';
   mainChart!: Chart;
   @ViewChild('divElement') plate!: ElementRef;
   readonly scrollRange = 16;
   readonly areaMinSize = 100;
   minDate: Moment = moment(new Date());
   maxDate: Moment = moment(new Date());
   daysLength = 0;
   selectedModel?: SelectedAreaModel;
   isDown = false;
   movingBalancePause = 10;
   private subs: Subscription[] = [];
   private movingBalanceTimer: ReturnType<typeof setTimeout> | null = null;
   private parentChartSelected$ = this.observeParentChart();

   constructor(private service: ChartBrushService) {}

   ngOnInit(): void {
      this.subs.push(this.observeSelectedArea());
      this.subs.push(this.observeParentRange());
   }

   ngOnDestroy(): void {
      this.subs.forEach(s => s.unsubscribe());
   }

   private mouseDownPosition = 0;

   mousedown($event: MouseEvent | TouchEvent) {
      this.isDown = true;
      this.mouseDownPosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
   }

   mousemove($event: MouseEvent | TouchEvent) {
      $event.preventDefault();
      if (this.isDown) {
         const newMousePosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
         this.service.moveArea(newMousePosition - this.mouseDownPosition);
         this.mouseDownPosition = newMousePosition;
      }
   }

   onMouseScroll(ev: WheelEvent, direction: 'up' | 'down'): void {
      ev.stopPropagation();
      ev.preventDefault();
      this.service.zoomArea(direction === 'down' ? this.scrollRange : -this.scrollRange);
   }

   updateMainChart(): void {
      const chartRectangle = this.mainChart.canvas.getBoundingClientRect();
      const leftPoint = this.selectedModel!.left;
      const rightPoint = this.selectedModel!.left + this.selectedModel!.width;
      const startIndex = Math.round((leftPoint / chartRectangle.width) * this.daysLength);
      const endIndex = Math.round((rightPoint / chartRectangle.width) * this.daysLength);
      let startDate = moment(this.minDate).add(startIndex, 'd');
      let endDate = moment(this.minDate).add(endIndex, 'd');
      if (startDate.isBefore(this.minDate)) startDate = moment(this.minDate);
      if (endDate.isAfter(this.maxDate)) endDate = moment(this.maxDate);
      this.updateMainChartBalanced(startDate, endDate);
   }

   resetAreaToDefault(): void {
      const chartRectangle = this.mainChart.canvas.getBoundingClientRect();
      this.service.setWidthRestrictions(chartRectangle.width, this.areaMinSize);
   }

   private observeParentChart() {
      return this.service.parentChart$.pipe(
         tap(c => {
            this.mainChart = c;
            this.mainChart.canvas.addEventListener('wheel', ev =>
               this.onMouseScroll(ev, ev.deltaY < 0 ? 'up' : 'down')
            );
            const obs = new ResizeObserver(() => this.resetAreaToDefault());
            obs.observe(this.mainChart.canvas);
         })
      );
   }

   private observeSelectedArea(): Subscription {
      return combineLatest([this.service.SelectedArea$, this.parentChartSelected$]).subscribe(([sa]) => {
         this.selectedModel = sa;
         this.plate.nativeElement.style.left = this.selectedModel.left + 'px';
         this.plate.nativeElement.style.width = this.selectedModel.width + 'px';
         this.updateMainChart();
      });
   }

   private observeParentRange(): Subscription {
      return combineLatest([this.service.parentChartRange$, this.parentChartSelected$]).subscribe(([range]) => {
         if (
            !range.min ||
            !range.max ||
            (range.min.getTime() === this.minDate.toDate().getTime() &&
               range.max.getTime() === this.maxDate.toDate().getTime())
         )
            return;
         this.minDate = moment(range.min);
         this.maxDate = moment(range.max);
         this.daysLength = this.maxDate.diff(this.minDate, 'd');
         this.resetAreaToDefault();
      });
   }

   private updateMainChartBalanced(startDate: Moment, endDate: Moment): void {
      if (this.movingBalanceTimer != null) {
         clearTimeout(this.movingBalanceTimer);
      }
      this.movingBalanceTimer = setTimeout(() => {
         this.movingBalanceTimer = null;
         (this.mainChart.options.scales![this.xAxisName] as any).min = startDate.toDate().getTime();
         (this.mainChart.options.scales![this.xAxisName] as any).max = endDate.toDate().getTime();
         this.mainChart.update();
      }, this.movingBalancePause);
   }
}
