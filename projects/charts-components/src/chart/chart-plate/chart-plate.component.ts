import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import {
  ActiveElement,
  BubbleDataPoint,
  ChartEvent,
  ChartTypeRegistry,
  InteractionMode,
  ScatterDataPoint,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from '../services';
import { ReplaySubject } from 'rxjs';
import { ChartDataModel, DateRangeModel } from '../models';
import { ChartAxisLimitService } from "../services/chart-axis-limit.service";

@Component({
  selector: 'app-chart-plate',
  templateUrl: './chart-plate.component.html',
  styleUrls: ['./chart-plate.component.scss'],
  providers: [ChartAxisLimitService]
})
export class ChartPlateComponent implements AfterViewInit {
  @ViewChild('chart')
  chartRef!: ElementRef;
  chart!: Chart;
  @Output() chartInitialized = new EventEmitter();
  @Output() chartUpdated = new EventEmitter();
  @Input() interactionMode: InteractionMode = 'x';
  private chartInProgress: ReturnType<typeof setTimeout> | null = null;
  private _dateRange: DateRangeModel = {};
  dateRange$ = new ReplaySubject<DateRangeModel>();

  @Input() set dateRange(ss: DateRangeModel) {
    this._dateRange = ss;
    this.dateRange$.next(this._dateRange);
  }

  constructor(private chartService: ChartService) {}

  ngAfterViewInit(): void {
    this.setChart();
  }

  setChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [],
      },
      plugins: [ChartDataLabels],
      options: {
        onClick: this.handleChartClick.bind(this),
        interaction: {
          intersect: true,
          mode: this.interactionMode,
        },
        animation: {
          duration: 300,
        },
        responsive: true,
        plugins: {
          datalabels: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
            },
          },
        },
        elements: {
          point: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
        },
      },
    });
    this.chartInitialized.emit();
  }

  updateChart(force = false): void {
    if (force && !this.chartInProgress) {
      this.chart?.update();
      this.chartUpdated.next();
      return;
    }
    if (this.chartInProgress != null) {
      clearTimeout(this.chartInProgress);
    }
    this.chartInProgress = setTimeout(() => {
      this.chartInProgress = null;
      try {
        (this.chart as any)._metasets = (this.chart as any)._metasets.filter((d: any) => !!d.controller);
        this.chart?.update();
      } catch {
        this.updateChart();
      }
      this.chartUpdated.next();
      console.log(this.chart);
    }, 250);
  }

  private handleChartClick(
    event: ChartEvent,
    elements: ActiveElement[],
    chart: Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>,
  ): void {
    const result: { [datasetLabel: string]: ChartDataModel } = {};
    elements.forEach((element) => {
      const label = chart.data.datasets[element.datasetIndex].label!;
      result[label] = (element.element as any).parsed as ChartDataModel;
    });
    this.chartService.setClickedElement({ data: result, event: event });
  }
}
