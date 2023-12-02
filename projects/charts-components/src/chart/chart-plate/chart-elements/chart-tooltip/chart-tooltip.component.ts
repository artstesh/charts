import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestructibleComponent } from '../../../common/destructible.component';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartTooltipSettings } from './chart-tooltip.settings';

@Component({
  selector: 'lib-chart-tooltip',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTooltipComponent extends DestructibleComponent implements OnInit, OnDestroy {
  constructor(private service: ChartPlateService, private mapService: SettingsMapService) {
    super();
  }

  _settings: ChartTooltipSettings = new ChartTooltipSettings();

  @Input() set settings(value: ChartTooltipSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setTooltip();
  }

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setTooltip()));
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
