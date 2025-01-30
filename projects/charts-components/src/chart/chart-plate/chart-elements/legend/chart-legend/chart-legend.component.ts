import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { DestructibleComponent } from '../../../../common/destructible.component';
import { ChartLegendSettings } from './chart-legend.settings';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

@Component({
  selector: 'art-chart-legend',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLegendComponent extends DestructibleComponent implements OnInit, OnDestroy {
  constructor(
    private service: ChartPlateService,
    private postboy: InnerPostboyService,
    private mapService: SettingsMapService,
  ) {
    super();
  }

  _settings: ChartLegendSettings = new ChartLegendSettings();

  @Input() set settings(value: ChartLegendSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setLegend();
  }

  ngOnInit(): void {
    this.subs.push(this.postboy.sub(ChartInitializedEvent).subscribe(() => this.setLegend()));
  }

  setLegend(): void {
    this.service.setLegend(this.mapService.chartLegend(this._settings, this.postboy));
  }

  onDestroy = () => {
    this.removeLegend();
  };

  private removeLegend(): void {
    this.service.setLegend({} as any);
  }
}
