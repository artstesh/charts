import {
   ChangeDetectionStrategy,
   Component,
   Input,
   OnChanges,
   OnDestroy,
   OnInit,
   Output,
   SimpleChanges
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Tick } from 'chart.js';
import { TimeUnit } from 'chart.js';
import { ChartPlateComponent } from "../../chart-plate.component";
import { DateRangeModel } from "../../../models";

@Component({
   selector: 'chart-x-axis',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class XAxisComponent implements OnInit, OnDestroy {
   @Input() displayGrid = false;
   private _displayFormat: { [p: string]: string } = { month: 'MMM' };
   private _timeUnit: TimeUnit = 'month';
   private _timeStepSize = 1;
   private _minValue?: number;
   private _maxValue?: number;

   @Input() set displayFormat(f: { [p: string]: string }) {
      if (f) this._displayFormat = f;
      this.setAxis();
   }
   @Input() set timeStepSize(ss: number) {
      this._timeStepSize = ss;
      this.setAxis();
   }
   @Input() set timeUnit(tu: TimeUnit) {
      this._timeUnit = tu;
      this.setAxis();
   }

   @Input() ticksCallback?: (
      tickValue: number | string,
      index: number,
      ticks: Tick[]
   ) => string | number | null | undefined;
   static id = 'x';
   private subs: Subscription[] = [];

   constructor(private parent: ChartPlateComponent) {}

   ngOnInit(): void {
      this.subs.push(this.parent.chartInitialized.subscribe(() => this.setAxis()));
      this.subs.push(this.parent.dateRange$.subscribe(dr => this.rangeUpdated(dr)));
   }

   protected rangeUpdated(dr: DateRangeModel): void {
      this._minValue = dr.minX;
      this._maxValue = dr.maxX;
      this.setAxis();
   }

   setAxis(): void {
      if (!this.parent.chart?.options?.scales) return;
      this.parent.chart.options.scales[XAxisComponent.id] = {
         type: 'time',
         time: {
            unit: this.timeUnit,
            stepSize: this.timeStepSize,
            displayFormats: this._displayFormat
         },
         grid: {
            display: this.displayGrid
         },
         ticks: {
            maxRotation: 0,
            callback: this.ticksCallback
         },
         display: 'auto'
      };
      this.setRange();
      this.parent.updateChart();
   }

   setRange(): void {
      if (this._minValue) {
         this.parent.chart.options.scales![XAxisComponent.id]!.min = this._minValue;
      }
      if (this._maxValue) {
         this.parent.chart.options.scales![XAxisComponent.id]!.max = this._maxValue;
      }
   }

   ngOnDestroy(): void {
      this.resetAxis();
      this.subs.forEach(s => s.unsubscribe());
   }

   private resetAxis(): void {
      if (!this.parent?.chart?.data?.datasets) return;
      if (!this.parent?.chart?.options?.scales) return;
      this.parent.chart.options.scales[XAxisComponent.id] = {};
      this.parent.updateChart(true);
   }
}
