import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';
import { ChartDataModel } from '@cdk/chart/chart-plate/models/chart-data.model';
import { ChartService } from '@cdk/chart/services/chart.service';
import { ChartDataset } from 'chart.js';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';

@Component({
   selector: 'chart-area',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartAreaComponent extends AbstractChartTypeComponent {
   protected _upper: ChartDataModel[] = [];
   protected _lower: ChartDataModel[] = [];
   protected _upperFiltered: ChartDataModel[] = [];
   protected _lowerFiltered: ChartDataModel[] = [];
   @Input() set upper(d: ChartDataModel[]) {
      this._upper = d;
      this.dataUpdated();
   }
   @Input() set lower(d: ChartDataModel[]) {
      this._lower = d;
      this.dataUpdated();
   }
   @Input() order = 0;
   @Input() yAxisId = 'y';
   @Input() colors: string[] = [];

   constructor(protected parent: ChartPlateComponent, private service: ChartService) {
      super(parent);
   }

   protected updateFilteredData(): void {
      this._lowerFiltered = this._lower.filter(
         d =>
            (!this.dateRange.maxDate || this.dateRange.maxDate.getTime() >= d.x?.getTime()) &&
            (!this.dateRange.minDate || this.dateRange.minDate.getTime() < d.x?.getTime())
      );
      this._upperFiltered = this._upper.filter(
         d =>
            (!this.dateRange.maxDate || this.dateRange.maxDate.getTime() >= d.x?.getTime()) &&
            (!this.dateRange.minDate || this.dateRange.minDate.getTime() < d.x?.getTime())
      );
   }

   protected addDataset(): void {
      if (!this.parent.chart) return;
      const lower = this.getLine(
         `#${this._name}`,
         this._lowerFiltered,
         {
            target: '-1',
            below: this.service.getGradient(this.parent.chartRef)
         },
         this.colors[1]
      );
      this.parent.chart.data.datasets.push(this.getLine(this._name, this._upperFiltered, false, this.colors[0]), lower);
      this.parent.updateChart();
      this.parent.chart.options.onResize = () => {
         (lower as any).fill.below = this.service.getGradient(this.parent.chartRef);
         this.parent.updateChart();
      };
   }

   protected removeExistingDataset(requiredToDelete?: string): void {
      if (!this.parent?.chart?.data?.datasets) return;
      this.parent.chart.data.datasets = this.parent.chart.data.datasets.filter(
         d => (d.label != this._name && d.label != `#${this._name}`) || d.order !== this.order
      );
      if (requiredToDelete) {
         this.parent.chart.data.datasets = this.parent.chart.data.datasets.filter(
            d => d.label !== requiredToDelete && d.label !== `#${requiredToDelete}`
         );
      }
      this.updateChart();
   }

   private getLine(name: string, data: ChartDataModel[], fill: any, color: string): ChartDataset {
      return {
         type: 'line',
         order: this.order,
         label: name,
         data: data as any,
         fill: fill,
         yAxisID: this.yAxisId,
         backgroundColor: color,
         pointRadius: 0,
         pointHitRadius: 5,
         borderColor: 'transparent',
         legendStyle: 'band',
         legendPriority: this.legendOrderPriority
      } as ChartDataset;
   }
}
