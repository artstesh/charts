import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartConstants } from '../../../models/chart-constants';
import { ChartBrushService } from '../../services/chart-brush.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';
import { BrushRangeModel } from '../../models/brush-range.model';
import { DestructibleComponent } from '../../../common/destructible.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-brush-selection-area',
  templateUrl: './brush-selection-area.component.html',
  styleUrls: ['./brush-selection-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrushSelectionAreaComponent extends DestructibleComponent implements OnInit {
  mainChart!: Chart;
  @ViewChild('brushPlate') plate!: ElementRef;
  readonly scrollRange = 16;
  readonly areaMinSize = 100;
  minDate: number = 0;
  maxDate: number = 0;
  daysLength = 0;
  selectedModel?: BrushRangeModel;
  isDown = false;
  movingBalancePause = 10;
  private movingBalanceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private service: ChartBrushService,
    private postboy: ChartPostboyService,
    private detector: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeSelectedArea());
    this.subs.push(this.observeParentRange());
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
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
    let startDate = this.minDate + startIndex;
    let endDate = this.minDate + endIndex;
    if (startDate < this.minDate) startDate = this.minDate;
    if (endDate > this.maxDate) endDate = this.maxDate;
    this.updateMainChartBalanced(startDate, endDate);
  }

  resetAreaToDefault(): void {
    const chartRectangle = this.mainChart.canvas.getBoundingClientRect();
    this.service.setWidthRestrictions(chartRectangle.width, this.areaMinSize);
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
    return this.service.SelectedArea$.subscribe((sa) => {
      this.selectedModel = sa;
      this.plate.nativeElement.style.left = this.selectedModel.left + 'px';
      this.plate.nativeElement.style.width = this.selectedModel.width + 'px';
      this.updateMainChart();
    });
  }

  private observeParentRange(): Subscription {
    return this.service.parentChartRange$.subscribe((range) => {
      if (!range.min || !range.max || (range.min === this.minDate && range.max === this.maxDate)) return;
      this.minDate = range.min;
      this.maxDate = range.max;
      this.daysLength = 1; //(this.mainChart?.scales?.[ChartConstants.BottomAxisId] as Scale<CoreScaleOptions>);
      this.resetAreaToDefault();
    });
  }

  private updateMainChartBalanced(start: number, end: number): void {
    if (this.movingBalanceTimer != null) {
      clearTimeout(this.movingBalanceTimer);
    }
    this.movingBalanceTimer = setTimeout(() => {
      this.movingBalanceTimer = null;
      (this.mainChart.options.scales![ChartConstants.BottomAxisId] as any).min = start;
      (this.mainChart.options.scales![ChartConstants.BottomAxisId] as any).max = end;
      this.mainChart.update();
    }, this.movingBalancePause);
  }
}
