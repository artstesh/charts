import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ChartPlateComponent } from '../chart-plate.component';
import { Subscription } from 'rxjs';
import { DateRangeModel } from "../../models";

@Component({
   selector: '',
   template: ''
})
export abstract class AbstractChartTypeComponent implements OnDestroy {
   protected _name = '';
   @Input() set name(n: string) {
      this.removeExistingDataset();
      this._name = n;
      this.addDatasetBalanced();
   }
   @Input() order = 0;
   @Input() legendOrderPriority = -1;
   protected dateRange: DateRangeModel = {};
   private subs: Subscription[] = [];
   private addDatasetInProgress: ReturnType<typeof setTimeout> | null = null;

   protected constructor(protected parent: ChartPlateComponent) {
   }

   ngOnInit(): void {
      this.subs.push(this.parent.chartInitialized.subscribe(() => this.addDatasetBalanced()));
      this.subs.push(this.parent.dateRange$.subscribe(dr => this.rangeUpdated(dr)));
   }

   ngOnDestroy(): void {
      this.removeExistingDataset();
      this.subs.forEach(s => s.unsubscribe());
   }

   protected dataUpdated(): void {
      this.updateFilteredData();
      this.removeExistingDataset();
      this.addDatasetBalanced();
   }

   protected addDatasetBalanced(): void {
      if (this.addDatasetInProgress != null) {
         clearTimeout(this.addDatasetInProgress);
      }
      this.addDatasetInProgress = setTimeout(() => {
         this.addDatasetInProgress = null;
         this.addDataset();
      }, 250);
   }

   protected abstract addDataset(): void;
   protected abstract updateFilteredData(): void;

   protected rangeUpdated(dr: DateRangeModel): void {
      this.dateRange = dr;
      this.dataUpdated();
   }

   protected removeExistingDataset(requiredToDelete?: string): void {
      if (!this.parent?.chart?.data?.datasets?.length) return;

      this.parent.chart.data.datasets = this.parent.chart.data.datasets.filter(
         d => d.label != this._name || d.order !== this.order
      );
      if (requiredToDelete) {
         this.parent.chart.data.datasets = this.parent.chart.data.datasets.filter(d => d.label !== requiredToDelete);
      }
      this.updateChart(true);
   }

   protected updateChart(force = false): void {
      this.parent?.updateChart(force);
   }
}
