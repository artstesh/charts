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

/**
 * Component that renders a clone of a brushable chart, keeping its datasets
 * and configurations in sync with the parent chart while adjusting its visual properties.
 * The chart clone is useful for reflecting data changes or user interactions on a secondary chart.
 *
 * This component is standalone and can be used independently in an Angular application.
 * It extends the functionality of the `DestructibleComponent`, providing
 * automated subscriptions management.
 *
 * Features:
 * - Synchronizes datasets from a parent chart.
 * - Keeps visual updates efficient with throttled change detection.
 * - Customizes chart elements, such as hiding unnecessary axes and legends.
 *
 * Dependencies:
 * - Requires a reference to a `Chart` instance from the parent chart.
 * - Uses Angular's `ChangeDetectorRef` for manual change detection.
 * - Utilizes the `InnerPostboyService` for inter-component communication.
 *
 * Code Behavior:
 * - On initialization, subscribes to parent chart events (e.g., data updates or initialization).
 * - Clones the parent chart's datasets and configurations.
 * - Handles graph visibility toggles efficiently using throttled callbacks.
 * - Automatically manages all subscriptions on destruction of the component.
 *
 * Methods:
 * - `ngOnInit`: Sets up observed subscriptions for parent chart events.
 * - `observeParentChart`: Observes changes in the parent's chart data and initializes chart if necessary.
 * - `observeOtherParentChanges`: Watches for commands to toggle graph visibility.
 * - `updateDataSets`: Updates the child chart's datasets, reflecting changes from the parent chart.
 * - `initChart`: Initializes the cloned chart based on the parent chart's configuration.
 */
@Component({
  selector: 'art-brush-chart-clone',
  standalone: true,
  templateUrl: './brush-chart-clone.component.html',
  styleUrls: ['./brush-chart-clone.component.scss'],
})
export class BrushChartCloneComponent extends DestructibleComponent implements OnInit {
  @ViewChild('chartClone')
  chartRef!: ElementRef;
  chart?: Chart;
  parentChart?: Chart;

  /**
   * Initializes a new instance of the class and sets up necessary dependencies.
   *
   * @param {InnerPostboyService} postboy - The service responsible for handling postboy operations.
   * @param {ChangeDetectorRef} detector - The service used to detect and trigger change detection in the component.
   * @return {void} No return value as this is a constructor.
   */
  constructor(private postboy: InnerPostboyService, private detector: ChangeDetectorRef) {
    super();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * This method sets up subscriptions to observe changes in parent components.
   * Manages subscriptions to ensure proper cleanup and resource handling.
   *
   * @return {void} Does not return any value.
   */
  ngOnInit(): void {
    this.subs.push(this.observeParentChart());
    this.subs.push(this.observeOtherParentChanges());
  }

  /**
   * Observes the parent chart by subscribing to initialization and data events.
   * Combines `ChartInitializedEvent` and `ChartDataEvent` with an audit time
   * of 100ms to manage chart initialization and data updates.
   *
   * @return {Subscription} A subscription that listens to the parent chart events.
   */
  private observeParentChart(): Subscription {
    return combineLatest([
      this.postboy.sub(ChartInitializedEvent),
      this.postboy.sub(ChartDataEvent).pipe(auditTime(100)),
    ]).subscribe(([init, _]) => {
      if (!this.chart) this.initChart(init.chart);
      this.updateDataSets();
      this.detector.detectChanges();
    });
  }

  /**
   * Listens for changes in the parent component and updates datasets based on the received command.
   * The method subscribes to the `ToggleGraphVisibilityCommand`, throttles events using `auditTime`,
   * and triggers the `updateDataSets` method in response.
   *
   * @return {Subscription} The subscription to the `ToggleGraphVisibilityCommand` observable.
   */
  private observeOtherParentChanges(): Subscription {
    return this.postboy
      .sub(ToggleGraphVisibilityCommand)
      .pipe(auditTime(100))
      .subscribe(() => this.updateDataSets());
  }

  /**
   * Updates the datasets of the chart by synchronizing them with the parent chart's datasets.
   * Handles additional axes configurations to remove unwanted axes.
   *
   * @return {void} No return value.
   */
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

  /**
   * Initializes the chart with specified configuration and links it to the parent chart.
   *
   * @param {Chart} parent The parent chart instance to inherit configuration and settings.
   * @return {void} This method does not return a value.
   */
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
