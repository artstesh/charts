import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { InteractionMode } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';
import { ChartAxisLimitService } from '../services/chart-axis-limit.service';
import { ChartPlateService } from './services/chart-plate.service';

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
  @Input() interactionMode: InteractionMode = 'x';

  constructor(private service: ChartPlateService) {}

  ngOnInit(): void {
    this.service.updateTrigger$.subscribe((force) => this.updateChart(force));
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  setChart(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [],
      },
      plugins: [ChartDataLabels],
      options: {
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
    this.service.setChart(this.chart);
    this.service.chartInitialized.emit();
  }

  updateChart(force = false): void {
    try {
      (this.chart as any)._metasets = (this.chart as any)._metasets.filter((d: any) => !!d.controller);
      this.chart?.update();
    } catch {
      this.service.updateChart();
    }
    this.service.chartUpdated.next();
  }
}
