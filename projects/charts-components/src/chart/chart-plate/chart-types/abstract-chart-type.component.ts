import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartTypeSettings } from './models/chart-type.settings';
import { ColorCollector } from '../../services';
import { ChartPlateService } from '../services/chart-plate.service';
import { SettingsMapService } from '../../services/settings-map.service';
import { ChartDataset } from 'chart.js';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { ChartLimitEvent } from '../../messages/events/chart-limit.event';

@Component({
  template: '',
})
export abstract class AbstractChartTypeComponent<T extends ChartTypeSettings<T>> implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  protected constructor(
    protected postboy: ChartPostboyService,
    protected service: ChartPlateService,
    protected mapService: SettingsMapService,
  ) {}

  protected abstract _settings: T;

  @Input() set settings(value: T | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this._settings.color = this._settings.color || ColorCollector.getColor(this._settings.order);
    this.dataUpdated();
  }

  ngOnInit(): void {
    if (!this._settings.color) this._settings.color = ColorCollector.getColor(this._settings.order);
    this.subs.push(
      this.postboy
        .subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID)
        .subscribe(() => this.service.addDataset(this.getDataset())),
    );
    this.subs.push(this.postboy.subscribe<ChartLimitEvent>(ChartLimitEvent.ID).subscribe(() => this.rangeUpdated()));
  }

  ngOnDestroy(): void {
    this.service.removeDataset(this._settings.id);
    this.subs.forEach((s) => s.unsubscribe());
  }

  protected dataUpdated(): void {
    this.updateFilteredData();
    this.service.removeDataset(this._settings.id);
    this.service.addDataset(this.getDataset());
  }

  protected abstract getDataset(): ChartDataset<any, any>;

  protected abstract updateFilteredData(): void;

  protected rangeUpdated(): void {
    this.dataUpdated();
  }
}
