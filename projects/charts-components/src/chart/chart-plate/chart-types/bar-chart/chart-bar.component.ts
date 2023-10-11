import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { ChartDataModel } from "../../../models";

@Component({
   selector: 'chart-bar',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartBarComponent extends AbstractChartTypeComponent {
   private _data!: ChartDataModel[];
   private _dataFiltered!: ChartDataModel[];
   @Input() set data(aw: ChartDataModel[]) {
      this._data = aw;
      this.dataUpdated();
   }
   @Input() order = 0;
   @Input() yAxisId = 'y';
   @Input() color?: string;
   @Input() thickness?: number;
   @Input() dataLabels: Options = {};

   constructor(protected parent: ChartPlateComponent) {
      super(parent);
   }

   protected updateFilteredData(): void {
      this._dataFiltered = this._data.filter(d => (!this.dateRange.maxDate || this.dateRange.maxDate.getTime() > d.x?.getTime())
         && (!this.dateRange.minDate || this.dateRange.minDate.getTime() < d.x?.getTime()));
   }

   protected addDataset(): void {
      if (!this.parent.chart) {
         return;
      }
      this.parent.chart.data.datasets.push({
         datalabels: this.dataLabels,
         label: this._name,
         order: this.order,
         data: this._dataFiltered as any,
         yAxisID: this.yAxisId,
         type: 'bar',
         backgroundColor: this.color,
         barThickness: this.thickness,
         legendStyle: 'bar',
         legendPriority: this.legendOrderPriority
      } as any as ChartDataset);
      this.updateChart();
   }
}
