import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';

import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset, ScriptableContext } from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';
import { ChartDataModel } from "../../../models";
import { ChartService } from "../../../services";

const skipped = (ctx: any, value: any) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);
const down = (ctx: any, value: any) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined);

@Component({
   selector: 'chart-line',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLineComponent extends AbstractChartTypeComponent {
   private _data!: ChartDataModel[];
   private _dataFiltered!: ChartDataModel[];
   @Input() set data(aw: ChartDataModel[]) {
      this._data = aw;
      this.dataUpdated();
   }
   @Input() order = 0;
   @Input() pointRadius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number) = 0;
   @Input() yAxisId = 'y';
   @Input() color!: string;
   @Input() uniquieId = '';
   @Input() enableSegments = true;
   @Input() tooltipShift?: number = 0;

   constructor(protected parent: ChartPlateComponent, private service: ChartService) {
      super(parent);
   }

   protected updateFilteredData(): void {
      this._dataFiltered = this._data.filter(
         d =>
            (!this.dateRange.maxDate || this.dateRange.maxDate.getTime() >= d.x?.getTime()) &&
            (!this.dateRange.minDate || this.dateRange.minDate.getTime() < d.x?.getTime())
      );
   }

   protected addDataset(): void {
      if (!this.parent.chart?.data) return;
      this.color = this.color || this.service.getRandomColor(this.getColorIdentifier());
      this.parent.chart.data.datasets.push({
         label: this._name,
         type: 'line',
         order: this.order,
         data: this._dataFiltered as any,
         fill: false,
         yAxisID: this.yAxisId,
         backgroundColor: this.color,
         pointRadius: this.pointRadius,
         pointHitRadius: 5,
         borderColor: this.color,
         spanGaps: true,
         segment: this.enableSegments
            ? {
                 borderColor: ctx => skipped(ctx, this.color) || down(ctx, this.color),
                 borderDash: ctx => skipped(ctx, [6, 6])
              }
            : undefined,
         legendStyle: 'line',
         legendPriority: this.legendOrderPriority,
         tooltipShift: this.tooltipShift
      } as ChartDataset);
      this.updateChart();
   }

   private getColorIdentifier(): string {
      return this.uniquieId || this._name;
   }
}
