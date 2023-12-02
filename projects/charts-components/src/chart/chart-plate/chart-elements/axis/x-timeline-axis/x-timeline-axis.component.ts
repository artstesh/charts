import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ChartAxisLimitService } from "../../../../services/chart-axis-limit.service";
import { ChartPlateService } from "../../../services/chart-plate.service";
import { SettingsMapService } from "../../../../services/settings-map.service";
import { XTimelineAxisSettings } from "./x-timeline-axis.settings";

@Component({
  selector: 'lib-x-timeline-axis',
  template: '',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XTimelineAxisComponent implements OnInit, OnDestroy {
  static id = 'x';
  _settings: XTimelineAxisSettings = new XTimelineAxisSettings();
  private subs: Subscription[] = [];

  @Input() set settings(value: XTimelineAxisSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.limitService.setHorizontalLimits(this._settings.limits[0], this._settings.limits[1]);
    this.setAxis();
  }

  constructor(
    private limitService: ChartAxisLimitService,
    private service: ChartPlateService,
    private mapService: SettingsMapService,
  ) {}

  ngOnInit(): void {
    this.subs.push(this.service.chartInitialized.subscribe(() => this.setAxis()));
  }

  setAxis(): void {
    this.service.setScale(XTimelineAxisComponent.id, this.mapService.xTimelineScale(this._settings));
  }

  ngOnDestroy(): void {
    this.service.resetScale(XTimelineAxisComponent.id);
    this.subs.forEach((s) => s.unsubscribe());
  }
}
