import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InteractionMode } from 'chart.js';
import Chart from 'chart.js/auto';
import keys from 'lodash/keys';
import * as moment from 'moment';
import { combineLatest, from, Observable, Subscription } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { ChartPlateComponent } from '../chart-plate/chart-plate.component';
import { ChartBrushService } from './services/chart-brush.service';

@Component({
   selector: 'app-chart-brush',
   templateUrl: './chart-brush.component.html',
   styleUrls: ['./chart-brush.component.scss']
})
export class ChartBrushComponent implements OnInit, OnDestroy {
   @ViewChild('chart')
   chartRef!: ElementRef;
   chart!: Chart;
   @Input() interactionMode: InteractionMode = 'x';
   @Input() xAxisName = 'x';
   private subs: Subscription[] = [];
   private parentChartInitialization$ = this.observeParentChartInitialization();
   private parentChartRangeChange$ = this.observeParentChartRangeChange();

   constructor(public mainChart: ChartPlateComponent, private service: ChartBrushService) {}

   ngOnInit(): void {
      this.subs.push(this.parentChartRangeChange$.subscribe());
   }

   ngOnDestroy(): void {
      this.subs.forEach(s => s.unsubscribe());
   }

   private observeParentChartInitialization(): Observable<any> {
      return from(this.mainChart.chartInitialized).pipe(
         tap(() => this.onParentInitialized()),
         shareReplay({ refCount: true, bufferSize: 1 })
      );
   }

   private observeParentChartRangeChange(): Observable<
      [
         any,
         {
            min?: Date | undefined;
            max?: Date | undefined;
         }
      ]
   > {
      return combineLatest([this.parentChartInitialization$, this.service.parentChartRange$]).pipe(
         tap(([, range]) => this.onParentRangeChanged(range))
      );
   }

   private onParentInitialized(): void {
      this.service.setParent(this.mainChart.chart);
      this.initChart();
      this.subs.push(this.observeParentUpdate());
   }

   private onParentRangeChanged(range: { min?: Date | undefined; max?: Date | undefined }): void {
      const brushScale = (this.chart as any).options.scales[this.xAxisName];
      if (range.min) brushScale.min = moment(range.min).toDate().getTime();
      if (range.max) brushScale.max = moment(range.max).toDate().getTime();
   }

   private observeParentUpdate(): Subscription {
      return this.mainChart.chartUpdated.subscribe(() => {
         this.chart.data.datasets = [...this.mainChart.chart.data.datasets];
         this.chart.update();
         //an ugly way to get rid of all additional axes through two updates
         keys(this.chart.scales)
            .filter(s => s != 'x')
            .forEach(s => (this.chart.options.scales![s]!.display = false));
         this.chart.update();
      });
   }

   private initChart(): void {
      this.chart = new Chart(this.chartRef.nativeElement, {
         type: 'line',
         data: {
            datasets: []
         },
         options: {
            responsive: true,
            animation: false,
            plugins: {
               tooltip: {
                  enabled: false
               },
               legend: { display: false }
            },
            events: [],
            maintainAspectRatio: false,
            scales: {
               x: {
                  type: 'time',
                  time: {
                     unit: 'month'
                  },
                  grid: {
                     display: false,
                     drawBorder: false
                  },
                  ticks: {
                     display: true,
                     maxRotation: 0,
                     font: {
                        size: 12,
                        family: 'Nunito, serif'
                     },
                     autoSkip: true,
                     callback: (tickValue, index, ticks) => {
                        return index === ticks.length - 1 ? '' : tickValue;
                     },
                     align: 'start'
                  },
                  position: 'center'
               },
               y: {
                  display: false
               }
            },
            elements: {
               point: {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
               }
            }
         }
      }) as any;
   }
}
