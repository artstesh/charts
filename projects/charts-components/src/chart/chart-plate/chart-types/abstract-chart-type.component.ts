import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ChartPlateComponent } from '../chart-plate.component';
import { Subscription } from 'rxjs';
import { DateRangeModel } from "../../models";
import { ChartAxisLimitService } from "../../services/chart-axis-limit.service";
import { ChartTypeSettings } from "./models/chart-type.settings";
import { ChartLineSettings } from "./line-chart/chart-line.settings";
import { ChartService } from "../../services";

@Component({
   selector: '',
   template: ''
})
export abstract class AbstractChartTypeComponent<T extends ChartTypeSettings> implements OnDestroy {
  _settings: T;

  @Input() set settings(value: T | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this._settings.color = this._settings.color || this.service.getRandomColor(this._settings.name);
    this.dataUpdated();
  }
   private subs: Subscription[] = [];
   private addDatasetInProgress: ReturnType<typeof setTimeout> | null = null;

   protected constructor(protected parent: ChartPlateComponent,
                         private service: ChartService,protected limitService: ChartAxisLimitService,
                         settings: T) {
     this._settings = settings;
   }

   ngOnInit(): void {
      this.subs.push(this.parent.chartInitialized.subscribe(() => this.addDatasetBalanced()));
      this.subs.push(this.limitService.changed.subscribe(() => this.rangeUpdated()));
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

   protected rangeUpdated(): void {
      this.dataUpdated();
   }

   protected removeExistingDataset(requiredToDelete?: string): void {
      if (!this.parent?.chart?.data?.datasets?.length) return;

      this.parent.chart.data.datasets = this.parent.chart.data.datasets.filter(
         d => d.label != this._settings.name || d.order !== this._settings.order
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
