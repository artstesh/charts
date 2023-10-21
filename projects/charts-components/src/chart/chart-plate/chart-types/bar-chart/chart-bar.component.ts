import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';
import { AbstractChartTypeComponent } from '../abstract-chart-type.component';
import { ChartDataset } from 'chart.js';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { ChartDataModel } from "../../../models";
import { ChartAxisLimitService } from "../../../services/chart-axis-limit.service";
import { ChartService } from "../../../services";

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

   constructor(protected parent: ChartPlateComponent,
               private service: ChartService,
               protected limitService: ChartAxisLimitService) {
      super(parent, service, limitService);
   }

   protected updateFilteredData(): void {
      this._dataFiltered = this.limitService.examine(this._data);
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
