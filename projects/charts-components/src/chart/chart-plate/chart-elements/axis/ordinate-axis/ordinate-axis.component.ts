import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { ChartConstants } from '../../../../models/chart-constants';
import { OrdinateAxisFactory } from './ordinate-axis-factory.service';
import { OrdinateAxisSettings } from './ordinate-axis.settings';

@Component({
  selector: 'lib-ordinate-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdinateAxisComponent extends DestructibleComponent implements OnInit {
  private axisId = ChartConstants.LeftAxisId;

  constructor(private service: ChartPlateService, private mapService: OrdinateAxisFactory) {
    super();
  }

  _settings: OrdinateAxisSettings = new OrdinateAxisSettings();

  @Input() set settings(value: OrdinateAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(this._settings.getAxisId(), this.mapService.build(this._settings));
  }

  onDestroy = () => {
    this.resetAxis();
    this.subs.forEach((s) => s.unsubscribe());
  };

  private resetAxis(): void {
    this.service.resetScale(this._settings.getAxisId());
  }
}
