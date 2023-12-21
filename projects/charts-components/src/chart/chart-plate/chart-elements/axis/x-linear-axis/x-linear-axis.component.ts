import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChartAxisLimitService } from '../../../../services/chart-axis-limit.service';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartConstants } from '../../../../models/chart-constants';

@Component({
  selector: 'lib-x-linear-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XLinearAxisComponent extends DestructibleComponent implements OnInit {
  constructor(
    private limitService: ChartAxisLimitService,
    private service: ChartPlateService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

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
    this.service.setScale(ChartConstants.BottomAxisId, this.mapService.xLinearScale(this._settings));
  }

  onDestroy = () => {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  };

  private resetAxis(): void {
    this.service.resetScale(ChartConstants.BottomAxisId);
  }
}
