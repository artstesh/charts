import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartAxisLimitService } from '../../services/chart-axis-limit.service';
import { ChartTypeSettings } from './models/chart-type.settings';
import { ChartService } from '../../services';
import { ChartPlateService } from '../services/chart-plate.service';
import { SettingsMapService } from "../../services/settings-map.service";

@Component({
   selector: '',
   template: ''
})
export abstract class AbstractChartTypeComponent<T extends ChartTypeSettings<T>> implements OnDestroy {
  _settings: T;

  @Input() set settings(value: T | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this._settings.color = this._settings.color || this.chartService.getRandomColor(this._settings.name);
    this.dataUpdated();
  }
   private subs: Subscription[] = [];

   protected constructor(private chartService: ChartService,protected limitService: ChartAxisLimitService,
                         protected service: ChartPlateService,
                         private mapService: SettingsMapService,
                         settings: T) {
     this._settings = settings;
   }

   ngOnInit(): void {
      this.subs.push(this.service.chartInitialized.subscribe(() => this.addDataset()));
      this.subs.push(this.limitService.changed.subscribe(() => this.rangeUpdated()));
   }

   ngOnDestroy(): void {
      this.service.removeDataset(this._settings.name, this._settings.order);
      this.subs.forEach(s => s.unsubscribe());
   }

   protected dataUpdated(): void {
      this.updateFilteredData();
     this.service.removeDataset(this._settings.name, this._settings.order);
     this.addDataset();
   }

   protected abstract addDataset(): void;
   protected abstract updateFilteredData(): void;

   protected rangeUpdated(): void {
      this.dataUpdated();
   }
}
