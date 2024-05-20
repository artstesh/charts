import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { DestructibleComponent } from '../../../common/destructible.component';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { combineLatest } from 'rxjs';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';
import { ChartConstants } from '../../../models/chart-constants';
import { auditTime } from 'rxjs/operators';

@Component({
  selector: 'art-brush-chart-clone',
  templateUrl: './brush-chart-clone.component.html',
  styleUrls: ['./brush-chart-clone.component.scss'],
})
export class BrushChartCloneComponent extends DestructibleComponent implements OnInit {
  @ViewChild('chartClone')
  chartRef!: ElementRef;
  chart?: Chart;

  constructor(private postboy: ChartPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
  }

  private observeParentChart() {
    return combineLatest([
      this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID),
      this.postboy.subscribe<ChartDataEvent>(ChartDataEvent.ID).pipe(auditTime(100)),
    ]).subscribe(([init, data]) => {
      if (!this.chart) this.initChart(init.chart);
      this.updateDataSets(init.chart);
      this.detector.detectChanges();
    });
  }

  private updateDataSets(parent: Chart): void {
    if (!this.chart) return;
    this.chart.data.datasets = [...parent.data.datasets];
    this.chart.update();
    //an ugly way to get rid of all additional axes through two updates
    Object.keys(this.chart.scales)
      .filter((s) => s != ChartConstants.BottomAxisId)
      .forEach((s) => (this.chart!.options.scales![s]!.display = false));
    this.chart.update();
  }

  private initChart(parent: Chart): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: { display: false },
        },
        maintainAspectRatio: false,
        scales: {
          [ChartConstants.BottomAxisId]: {
            ...(parent.options.scales![ChartConstants.BottomAxisId] as any),
            display: false,
          },
          [ChartConstants.LeftAxisId]: {
            display: false,
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
  }
}
