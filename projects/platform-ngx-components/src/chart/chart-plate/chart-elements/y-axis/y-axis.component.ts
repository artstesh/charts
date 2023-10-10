import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChartPlateComponent } from '../../chart-plate.component';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-y-axis',
   template: '',
   styleUrls: [],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class YAxisComponent implements OnInit, OnDestroy, OnChanges {
   @Input() id = '';
   @Input() type: 'linear' = 'linear';
   @Input() position: 'left' | 'right' = 'right';
   @Input() displayGrid = false;
   private chartSub: Subscription;

   constructor(private parent: ChartPlateComponent) {
      this.chartSub = parent.chartInitialized.subscribe(() => this.displayAxis());
   }

   ngOnInit(): void {}

   ngOnChanges(changes: SimpleChanges): void {
      this.removeExistingAxis();
      this.displayAxis();
   }

   displayAxis(): void {
      if (!this.parent.chart) return;
      if (!this.parent?.chart?.options?.scales || !this.parent.chart.options.scales[this.id]) {
         this.addAxis();
      } else {
         this.activateAxis();
      }
      this.parent.updateChart();
   }

   addAxis(): void {
      if (!this.parent.chart?.options?.scales) return;
      this.parent.chart.options.scales[this.id] = {
         type: this.type as any,
         position: this.position,
         display: 'auto',
         grid: {
            display: this.displayGrid
         }
      };
   }

   activateAxis(): void {
      if (!this.parent?.chart?.options?.scales || !this.parent.chart.options.scales[this.id]) return;
      this.parent.chart.options.scales[this.id]!.display = true;
   }

   ngOnDestroy(): void {
      this.chartSub?.unsubscribe();
      this.removeExistingAxis();
   }

   private removeExistingAxis(): void {
      if (!this.parent?.chart?.data?.datasets) return;
      if (!this.parent?.chart?.options?.scales || !this.parent.chart.options.scales[this.id]) return;
      this.parent.chart.options.scales[this.id]!.display = false;
      this.parent.updateChart(true);
   }
}
