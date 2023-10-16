import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { ChartDataModel, ChartScatterConfigModel } from "../../../models";
import { AbstractChartTypeComponent } from "../abstract-chart-type.component";
import { ChartPlateComponent } from "../../chart-plate.component";
import { ChartService } from "../../../services";

@Component({
   selector: 'chart-scatter',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartScatterComponent extends AbstractChartTypeComponent {
   private _data!: ChartDataModel[];
   private _dataFiltered!: ChartDataModel[];
   @Input() set data(aw: ChartDataModel[]) {
      this._data = aw;
      this.dataUpdated();
   }
   @Input() order = 0;
   @Input() uniquieId = '';
   @Input() config: ChartScatterConfigModel = new ChartScatterConfigModel();

   constructor(protected parent: ChartPlateComponent, private service: ChartService) {
      super(parent);
   }

   protected updateFilteredData(): void {
      this._dataFiltered = this._data.filter(d => (!this.dateRange.maxX || this.dateRange.maxX > d.x)
         && (!this.dateRange.minX || this.dateRange.minX < d.x));
   }

   protected addDataset(): void {
      if (!this.parent.chart?.data) return;
      this.config.color = this.config.color || this.service.getRandomColor(this.getColorIdentifier());
      this.parent.chart.data.datasets.push({
         label: this._name,
         type: 'scatter',
         order: this.order,
         data: this._dataFiltered.map(d => ({ y: d.y, x: d.x })) as any,
         yAxisID: this.config.yAxisId,
         backgroundColor: this.config.color,
         borderColor: this.config.color,
         pointRadius: this.config.pointRadius || 3,
         pointHitRadius: this.config.pointHitRadius || this.config.pointRadius || 5,
         pointStyle: this.config.pointStyle,
         pointBorderColor: this.config.borderColor,
         pointBorderWidth: this.config.pointBorderWidth,
         pointHoverRadius: this.config.pointHoverRadius,
         pointHoverBackgroundColor: this.config.pointHoverBackgroundColor,
         pointHoverBorderWidth: this.config.pointHoverBorderWidth,
         legendStyle: this.config.pointStyle,
         legendPriority: this.legendOrderPriority,
         hidden: this.config.hidden
      } as ChartDataset);
      if (this.parent.chart.options.plugins?.legend?.labels) {
         this.parent.chart.options.plugins.legend.labels = {
            usePointStyle: true
         };
      }
      this.updateChart();
   }

   private getColorIdentifier(): string {
      return this.uniquieId || this.name;
   }
}
