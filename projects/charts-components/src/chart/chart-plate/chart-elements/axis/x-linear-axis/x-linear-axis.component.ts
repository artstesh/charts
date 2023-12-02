import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartAxisLimitService } from '../../../../services/chart-axis-limit.service';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';

@Component({
  selector: 'lib-x-linear-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XLinearAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  private subs: Subscription[] = [];

  constructor(
    private limitService: ChartAxisLimitService,
    private service: ChartPlateService,
    private mapService: SettingsMapService,
  ) {}

  _settings: XLinearAxisSettings = new XLinearAxisSettings();

  @Input() set settings(value: XLinearAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.limitService.setHorizontalLimits(this._settings.limits[0], this._settings.limits[1]);
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(XLinearAxisComponent.id, this.mapService.xLinearScale(this._settings));
  }

  ngOnDestroy(): void {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  }

  private resetAxis(): void {
    this.service.resetScale(XLinearAxisComponent.id);
  }
}
