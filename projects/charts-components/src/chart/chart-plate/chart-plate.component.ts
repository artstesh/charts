import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectFlags,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { ChartPlateService } from './services/chart-plate.service';
import { SettingsMapService } from '../services/settings-map.service';
import { ChartPlateSettings } from './models/chart-plate.settings';
import { registerAdapter } from '../utils/chart-date.adapter';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../services/inner-postboy.service';
import { InnerMessageRegistrator } from '../services/inner-message-registrator.service';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { ChartAreaType } from './chart-types/models/area.type';
import { ChartPostboyService } from '../services/chart-postboy.service';
import { ExternalMessageRegistrator } from '../services/external-message.registrator';
import { GraphVisibilityService } from './services/graph-visibility.service';

registerAdapter();

@Component({
  selector: 'art-chart-plate',
  templateUrl: './chart-plate.component.html',
  styleUrls: ['./chart-plate.component.scss'],
  providers: [
    ChartPlateService,
    InnerMessageRegistrator,
    InnerPostboyService,
    GraphVisibilityService,
    ExternalMessageRegistrator,
    {
      provide: ChartPostboyService,
      useFactory: () => {
        const colorService = inject(ChartPostboyService, InjectFlags.Optional | InjectFlags.SkipSelf);
        return colorService || new ChartPostboyService();
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPlateComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chart')
  chartRef!: ElementRef;
  chart!: Chart;
  private subs: Subscription[] = [];

  constructor(
    private postboy: InnerPostboyService,
    private innerRegistrator: InnerMessageRegistrator,
    private registrator: ExternalMessageRegistrator,
    private mapService: SettingsMapService,
  ) {
    Chart.register(ChartAreaType);
    this.innerRegistrator.up();
    this.registrator.up();
  }

  private _settings: ChartPlateSettings = new ChartPlateSettings();

  @Input() set settings(value: ChartPlateSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    if (!!this.chart?.config) (this.chart.config as any).type = value.type;
    this.postboy.fire(new ChartUpdateCommand());
  }

  ngOnInit(): void {
    this.subs.push(
      this.postboy.sub(ChartUpdateCommand).subscribe((ev) => this.updateChart(ev.force)),
    );
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  ngOnDestroy(): void {
    this.innerRegistrator.down();
    this.registrator.down();
    this.subs.forEach((s) => s.unsubscribe());
  }

  setChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, this.mapService.chartPlateConfig(this._settings, this.postboy));
    this.postboy.fire(new ChartInitializedEvent(this.chart));
  }

  updateChart(force = false): void {
    try {
      if (!!(this.chart as any)._metasets)
        (this.chart as any)._metasets = (this.chart as any)._metasets.filter((d: any) => !!d.controller);
      this.chart.update();
    } catch {
      // ignore
    }
  }
}
