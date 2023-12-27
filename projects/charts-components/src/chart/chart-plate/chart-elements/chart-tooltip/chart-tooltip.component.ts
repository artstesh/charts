import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../common/destructible.component';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartTooltipSettings } from './chart-tooltip.settings';
import { ChartPostboyService } from "../../../services/chart-postboy.service";
import { ChartInitializedEvent } from "../../../messages/events/chart-initialized.event";

@Component({
  selector: 'lib-chart-tooltip',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTooltipComponent extends DestructibleComponent implements OnInit, OnDestroy {
  constructor(private service: ChartPlateService,
              private postboy: ChartPostboyService,private mapService: SettingsMapService) {
    super();
  }

  _settings: ChartTooltipSettings = new ChartTooltipSettings();

  @Input() set settings(value: ChartTooltipSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setTooltip();
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID)
      .subscribe(() => this.setTooltip()));
  }

  onDestroy = () => {
    this.eliminateTip();
  };

  private setTooltip(): void {
    this.service.setTooltip(this.mapService.tooltip(this._settings));
  }

  private eliminateTip(): void {
    this.service.setTooltip({});
  }
}
