import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractChartTypeComponent } from '@cdk/chart/chart-plate/chart-types/abstract-chart-type.component';
import { ChartDataModel } from '@cdk/chart/chart-plate/models';
import { ChartPlateComponent } from '@cdk/chart/chart-plate/chart-plate.component';
import { ChartService } from '@cdk/chart/services';
import { ChartDataset } from 'chart.js';
import { ChartScatterConfigModel } from './';

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
      this._dataFiltered = this._data.filter(d => (!this.dateRange.maxDate || this.dateRange.maxDate.getTime() > d.x?.getTime())
         && (!this.dateRange.minDate || this.dateRange.minDate.getTime() < d.x?.getTime()));
   }

   protected addDataset(): void {
      if (!this.parent.chart?.data) return;
      this.config.color = this.config.color || this.service.getRandomColor(this.getColorIdentifier());
      this.parent.chart.data.datasets.push({
         label: this._name,
         type: 'scatter',
         order: this.order,
         data: this._dataFiltered.map(d => ({ y: d.y, x: d.x.getTime() })) as any,
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
