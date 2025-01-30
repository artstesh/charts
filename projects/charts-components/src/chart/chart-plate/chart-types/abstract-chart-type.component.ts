import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartTypeSettings } from './models/chart-type.settings';
import { ColorCollector } from '../../services';
import { ChartPlateService } from '../services/chart-plate.service';
import { ChartDataset } from 'chart.js';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import Chart from 'chart.js/auto';

@Component({
  template: '',
})
export abstract class AbstractChartTypeComponent<T extends ChartTypeSettings<T>> implements OnInit, OnDestroy {
  protected subs: Subscription[] = [];
  protected chart?: Chart;

  protected constructor(protected postboy: InnerPostboyService, protected service: ChartPlateService) {}

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
      this.postboy.sub(ChartInitializedEvent).subscribe((ev) => {
        this.chart = ev.chart;
        this.getDataset().forEach((ds) => this.service.addDataset(ds));
      }),
    );
    this.initial();
  }

  ngOnDestroy(): void {
    this.service.removeDataset(this._settings.id, this.alsoDelete());
    this.subs.forEach((s) => s.unsubscribe());
  }

  protected dataUpdated(): void {
    this.service.removeDataset(this._settings.id, this.alsoDelete());
    this.getDataset().forEach((ds) => this.service.addDataset(ds));
  }

  protected abstract getDataset(): ChartDataset<any, any>[];
  protected alsoDelete = (): string | undefined => undefined;
  protected initial = () => {};
}
