import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { ChartAxisLimitService } from '../../services/chart-axis-limit.service';
import { ChartTypeSettings } from './models/chart-type.settings';
import { ChartService } from '../../services';
import { ChartPlateService } from '../services/chart-plate.service';
import { SettingsMapService } from '../../services/settings-map.service';
import { ChartDataset } from 'chart.js';

@Component({
  selector: '',
  template: '',
})
export abstract class AbstractChartTypeComponent<T extends ChartTypeSettings<T>> implements OnInit,OnDestroy {
  _settings: T;

  @Input() set settings(value: T | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this._settings.color = this._settings.color || this.chartService.getRandomColor(this._settings.name);
    this.dataUpdated();
  }

  private subs: Subscription[] = [];

  protected constructor(
    private chartService: ChartService,
    protected limitService: ChartAxisLimitService,
    protected service: ChartPlateService,
    protected mapService: SettingsMapService,
    settings: T,
  ) {
    this._settings = settings;
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.service.addDataset(this.getDataset())));
    this.subs.push(this.limitService.changed.subscribe(() => this.rangeUpdated()));
  }

  ngOnDestroy(): void {
    this.service.removeDataset(this._settings.name, this._settings.order);
    this.subs.forEach((s) => s.unsubscribe());
  }

  protected dataUpdated(): void {
    this.updateFilteredData();
    this.service.removeDataset(this._settings.name, this._settings.order);
    this.service.addDataset(this.getDataset());
  }

  protected abstract getDataset(): ChartDataset<any, any>;

  protected abstract updateFilteredData(): void;

  protected rangeUpdated(): void {
    this.dataUpdated();
  }
}
