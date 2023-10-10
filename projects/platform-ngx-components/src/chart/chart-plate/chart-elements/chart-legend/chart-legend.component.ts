import {
   AfterViewInit,
   ChangeDetectionStrategy,
   Component,
   Input,
   OnChanges,
   OnDestroy,
   OnInit,
   SimpleChanges
} from '@angular/core';
import { LayoutPosition } from 'chart.js/types/layout';
import { Subscription } from 'rxjs';
import {ChartPlateComponent} from "../../chart-plate.component";

@Component({
   selector: 'chart-legend',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLegendComponent implements OnInit, OnDestroy, OnChanges {
   @Input() position: LayoutPosition = 'bottom';
   private chartSub: Subscription;

   constructor(private parent: ChartPlateComponent) {
      this.chartSub = parent.chartInitialized.subscribe(() => this.addLegend());
   }

   ngOnInit(): void {}

   ngOnChanges(changes: SimpleChanges): void {
      this.addLegend();
   }

   ngOnDestroy(): void {
      this.chartSub?.unsubscribe();
      this.eliminateLegend();
   }

   private addLegend(): void {
      if (!this.parent?.chart?.options?.plugins) return;
      this.parent.chart.options.plugins.legend = {
         display: true,
         position: this.position,
         labels: {
            filter: function (legendItem: any, data) {
               return !(legendItem.text as string).startsWith('#');
            }
         }
      };
      this.parent.updateChart();
   }

   private eliminateLegend(): void {
      if (!this.parent?.chart?.options?.plugins) return;
      this.parent.chart.options.plugins.legend = {};
      this.parent.updateChart(true);
   }
}
