import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import Chart from 'chart.js/auto';
import { BrushRangeModel } from '../../models/brush-range.model';
import { DestructibleComponent } from '../../../common/destructible.component';
import { Subscription } from 'rxjs';
import { BrushAreaEvent } from '../../messages/events/brush-area.event';
import { ZoomAreaCommand } from '../../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../../messages/commands/move-brush.command';
import { ChartScrollEvent } from '../../../messages/events/chart-scroll.event';

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
  selectedModel?: BrushRangeModel;
  isDown = false;
  private mouseDownPosition = 0;

  constructor(private postboy: ChartPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeSelectedArea());
    this.subs.push(this.observeParentScroll());
  }

  private observeParentScroll() {
    return this.postboy
      .subscribe<ChartScrollEvent>(ChartScrollEvent.ID)
      .subscribe((ev) =>
        this.postboy.fire(new ZoomAreaCommand(ev.direction === 'down' ? this.scrollRange : -this.scrollRange)),
      );
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

  private observeParentChart() {
    return this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe((ev) => {
      this.mainChart = ev.chart;
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
    });
  }
}
