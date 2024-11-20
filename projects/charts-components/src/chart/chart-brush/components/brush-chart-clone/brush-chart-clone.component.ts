import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { DestructibleComponent } from '../../../common/destructible.component';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { combineLatest, Subscription } from 'rxjs';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';
import { ChartConstants } from '../../../models/chart-constants';
import { auditTime } from 'rxjs/operators';
import { ToggleGraphVisibilityCommand } from '../../../messages/commands/toggle-graph-visibility.command';

@Component({
  selector: 'art-brush-chart-clone',
  templateUrl: './brush-chart-clone.component.html',
  styleUrls: ['./brush-chart-clone.component.scss'],
})
export class BrushChartCloneComponent extends DestructibleComponent implements OnInit {
  @ViewChild('chartClone')
  chartRef!: ElementRef;
  chart?: Chart;
  parentChart?: Chart;

  constructor(private postboy: InnerPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeOtherParentChanges());
  }

  private observeParentChart(): Subscription {
    return combineLatest([
      this.postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID),
      this.postboy.subscribe(ChartDataEvent.ID).pipe(auditTime(100)),
    ]).subscribe(([init, _]) => {
      if (!this.chart) this.initChart(init.chart);
      this.updateDataSets();
      this.detector.detectChanges();
    });
  }

  private observeOtherParentChanges(): Subscription {
    return this.postboy
      .subscribe<ToggleGraphVisibilityCommand>(ToggleGraphVisibilityCommand.ID)
      .pipe(auditTime(100))
      .subscribe(() => this.updateDataSets());
  }

  private updateDataSets(): void {
    if (!this.chart || !this.parentChart) return;
    this.chart.data.datasets = [...this.parentChart.data.datasets];
    this.chart.update();
    //an ugly way to get rid of all additional axes through two updates
    Object.keys(this.chart.scales)
      .filter((s) => s != ChartConstants.BottomAxisId)
      .forEach((s) => (this.chart!.options.scales![s]!.display = false));
    this.chart.update();
  }

  private initChart(parent: Chart): void {
    this.parentChart = parent;
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
