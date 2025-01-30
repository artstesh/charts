import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartConstants } from '../../../../models/chart-constants';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';

@Component({
  selector: 'art-x-timeline-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XTimelineAxisComponent extends DestructibleComponent implements OnInit {
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  _settings: XTimelineAxisSettings = new XTimelineAxisSettings();

  @Input() set settings(value: XTimelineAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setAxis();
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(ChartConstants.BottomAxisId, this.mapService.xTimelineScale(this._settings));
  }

  onDestroy = () => {
    this.service.resetScale(ChartConstants.BottomAxisId);
  };
}
