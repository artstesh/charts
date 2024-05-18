import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartConstants } from '../../../models/chart-constants';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';
import { BrushRangeModel } from '../../models/brush-range.model';
import { DestructibleComponent } from '../../../common/destructible.component';
import { Subscription } from 'rxjs';
import { ChartLimitEvent } from '../../../messages/events/chart-limit.event';
import { BrushAreaEvent } from '../../messages/events/brush-area.event';
import { ZoomAreaCommand } from '../../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../../messages/commands/move-brush.command';
import { WidthRestrictionsCommand } from '../../messages/commands/width-restrictions.command';
import { ChartAxisLimitsModel } from '../../../models/chart-axis-limits.model';

@Component({
  selector: 'art-brush-selection-area',
  templateUrl: './brush-selection-area.component.html',
  styleUrls: ['./brush-selection-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrushSelectionAreaComponent extends DestructibleComponent implements OnInit {
  mainChart!: Chart;
  @ViewChild('brushPlate') plate!: ElementRef;
  readonly scrollRange = 16;
  readonly areaMinSize = 100;
  maxValue: number = 0;
  minValue: number = 0;
  selectedModel?: BrushRangeModel;
  isDown = false;
  movingBalancePause = 10;
  private movingBalanceTimer: ReturnType<typeof setTimeout> | null = null;
  private mouseDownPosition = 0;

  constructor(private postboy: ChartPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeSelectedArea());
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  mousedown($event: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.mouseDownPosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
  }

  mousemove($event: MouseEvent | TouchEvent) {
    $event.preventDefault();
    if (this.isDown) {
      const newMousePosition = $event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX;
      this.postboy.fire(new MoveBrushCommand(newMousePosition - this.mouseDownPosition));
      this.mouseDownPosition = newMousePosition;
    }
  }

  onMouseScroll(ev: WheelEvent, direction: 'up' | 'down'): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.postboy.fire(new ZoomAreaCommand(direction === 'down' ? this.scrollRange : -this.scrollRange));
  }

  updateMainChart(): void {
    let daysLength = 1;
    const ticks = this.mainChart.scales[ChartConstants.BottomAxisId].getTicks();
    if (!!ticks.length && ticks.length >= 2) daysLength = ticks[1].value - ticks[0].value;
    const chartRectangle = this.mainChart.canvas.getBoundingClientRect();
    const leftPoint = this.selectedModel!.left;
    const rightPoint = this.selectedModel!.left + this.selectedModel!.width;
    const startIndex = Math.round((leftPoint / chartRectangle.width) * daysLength);
    const endIndex = Math.round((rightPoint / chartRectangle.width) * daysLength);
    let startDate = this.maxValue + startIndex;
    let endDate = this.maxValue + endIndex;
    if (startDate < this.minValue) startDate = this.minValue;
    if (endDate > this.maxValue) endDate = this.maxValue;
    console.log('sdfasfsadfDDDDDDDDDDDD');
    this.updateMainChartBalanced(startDate, endDate);
  }

  resetAreaToDefault(): void {
    const chartRectangle = this.mainChart.canvas.getBoundingClientRect();
    this.postboy.fire(new WidthRestrictionsCommand(chartRectangle.width, this.areaMinSize));
  }

  private observeParentChart() {
    return this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe((ev) => {
      this.mainChart = ev.chart;
      this.mainChart.canvas.addEventListener('wheel', (ev) => this.onMouseScroll(ev, ev.deltaY < 0 ? 'up' : 'down'));
      const obs = new ResizeObserver(() => this.resetAreaToDefault());
      obs.observe(this.mainChart.canvas);
      this.detector.detectChanges();
    });
  }

  private observeSelectedArea(): Subscription {
    return this.postboy.subscribe<BrushAreaEvent>(BrushAreaEvent.ID).subscribe((ev) => {
      if (!this.plate) return;
      this.selectedModel = ev.range;
      this.plate.nativeElement.style.left = ev.range.left + 'px';
      this.plate.nativeElement.style.width = ev.range.width + 'px';
      this.detector.detectChanges();
      if (ev.range.changed) this.updateMainChart();
    });
  }

  private updateMainChartBalanced(start: number, end: number): void {
    this.postboy.fire(new ChartLimitEvent(new ChartAxisLimitsModel(start, end)));
  }
}
