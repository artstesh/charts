import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartConstants } from '../../../../models/chart-constants';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

@Component({
  selector: 'art-x-linear-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XLinearAxisComponent extends DestructibleComponent implements OnInit {
  constructor(
    private postboy: InnerPostboyService,
    private service: ChartPlateService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  _settings: XLinearAxisSettings = new XLinearAxisSettings();

  @Input() set settings(value: XLinearAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(
      this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID).subscribe(() => this.setAxis()),
    );
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
