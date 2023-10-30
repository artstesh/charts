import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { InteractionMode } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { ChartAxisLimitService } from '../services/chart-axis-limit.service';
import { ChartPlateService } from './services/chart-plate.service';
import { SettingsMapService } from "../services/settings-map.service";
import { ColorCollector } from "../services";
import { ChartPlateSettings } from "./models/chart-plate.settings";

@Component({
  selector: 'app-chart-plate',
  templateUrl: './chart-plate.component.html',
  styleUrls: ['./chart-plate.component.scss'],
  providers: [ChartAxisLimitService, ChartPlateService],
})
export class ChartPlateComponent implements AfterViewInit, OnInit, OnDestroy {
  private subs: Subscription[] = [];
  @ViewChild('chart')
  chartRef!: ElementRef;
  chart!: Chart;
  private _settings: ChartPlateSettings = new ChartPlateSettings();

  @Input() set settings(value: ChartPlateSettings | undefined) {
    if (!value || this._settings.isSame(value)) return;
    this._settings = value;
    this.setChart();
  }

  constructor(private service: ChartPlateService, private mapService: SettingsMapService) {}

  ngOnInit(): void {
    this.subs.push(this.service.updateTrigger$.subscribe((force) => this.updateChart(force)));
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  setChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, this.mapService.chartPlateConfig(this._settings));
    this.service.setChart(this.chart);
    this.service.chartInitialized.emit();
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
