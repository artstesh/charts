import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { XLinearAxisSettings } from '../x-linear-axis/x-linear-axis.settings';
import { ChartConstants } from '../../../../models/chart-constants';

@Component({
  selector: 'lib-ordinate-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdinateAxisComponent extends DestructibleComponent implements OnInit {
  private axisId = ChartConstants.LeftAxisId;

  constructor(private service: ChartPlateService, private mapService: SettingsMapService) {
    super();
  }

  _settings: XLinearAxisSettings = new XLinearAxisSettings();

  @Input() set settings(value: XLinearAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(this.axisId, this.mapService.xLinearScale(this._settings));
  }

  onDestroy = () => {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  };

  private resetAxis(): void {
    this.service.resetScale(this.axisId);
  }
}
