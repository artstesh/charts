import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartPlateComponent } from '../../../chart-plate.component';
import { ChartAxisLimitService } from '../../../../services/chart-axis-limit.service';
import { LinearAxisSettings } from './linear-axis.settings';

@Component({
  selector: 'lib-x-linear-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XLinearAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  _settings: LinearAxisSettings = new LinearAxisSettings();
  private subs: Subscription[] = [];

  @Input() set settings(value: LinearAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.limitService.setHorizontalLimits(this._settings.limits[0], this._settings.limits[1]);
    this.setAxis();
  }

  constructor(private parent: ChartPlateComponent, private limitService: ChartAxisLimitService) {}

  ngOnInit(): void {
    this.subs.push(this.parent.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    if (!this.parent.chart?.options?.scales) return;
    this.parent.chart.options.scales[XLinearAxisComponent.id] = {
      type: 'linear',
      grid: {
        display: this._settings.displayGrid,
      },
      display: 'auto',
    };
    this.setRange();
    this.parent.updateChart();
  }

  setRange(): void {
    if (this._settings.limits[0]) {
      this.parent.chart.options.scales![XLinearAxisComponent.id]!.min = this._settings.limits[0];
    }
    if (this._settings.limits[1]) {
      this.parent.chart.options.scales![XLinearAxisComponent.id]!.max = this._settings.limits[1];
    }
  }

  ngOnDestroy(): void {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  }

  private resetAxis(): void {
    if (!this.parent?.chart?.data?.datasets) return;
    if (!this.parent?.chart?.options?.scales) return;
    this.parent.chart.options.scales[XLinearAxisComponent.id] = {};
    this.parent.updateChart(true);
  }
}
