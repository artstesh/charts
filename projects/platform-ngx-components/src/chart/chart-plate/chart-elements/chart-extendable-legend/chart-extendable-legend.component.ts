import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChartComponentLike } from 'chart.js';
import Chart from 'chart.js/auto';
import groupBy from 'lodash/groupBy';
import keys from 'lodash/keys';
import orderBy from 'lodash/orderBy';
import { Observable, of, Subscription } from 'rxjs';
import {ChartPlateComponent} from "../../chart-plate.component";
import {LegendItemModel} from "./legend-item.model";
import {DatasetModel} from "../../../models";

@Component({
   selector: 'chart-extendable-legend',
   templateUrl: './chart-extendable-legend.component.html',
   styleUrls: ['./chart-extendable-legend.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartExtendableLegendComponent implements OnInit {
   @Input() showAxisPosition = true;
   @Input() resetDatasetsVisibilityTrigger: Observable<void> = of();
   @Input() skipedDatasetLabels: string[] = [];
   private subscriptions?: Subscription[];
   containerId = 'legend-container';
   private pluginId = 'chart-extendable-element';
   labels: LegendItemModel[] = [];
   private hiddenLabels: string[] = [];

   constructor(private parent: ChartPlateComponent, private detector: ChangeDetectorRef) {}

   ngOnInit(): void {
      this.subscriptions = [
         this.parent.chartInitialized.subscribe(() => this.addLegend()),
         this.observeResetDatasetsVisibilityTrigger()
      ];
      Chart.register(this.htmlLegendPlugin as ChartComponentLike);
   }

   ngOnDestroy(): void {
      this.subscriptions?.forEach(sub => sub.unsubscribe());
      Chart.unregister(this.htmlLegendPlugin as ChartComponentLike);
   }

   private addLegend(): void {
      if (!this.parent?.chart?.options?.plugins) return;
      this.parent.chart.options.plugins.legend = {
         display: false
      };
      (this.parent.chart.options.plugins as any).htmlLegend = {
         containerID: this.containerId
      };
      this.parent.updateChart();
   }

   htmlLegendPlugin = {
      id: this.pluginId,
      afterUpdate: () => {
         this.labels = [];
         if (!this.parent?.chart?.options?.plugins?.legend?.labels) {
            return;
         }
         const groupedByOrder = groupBy(
            this.parent.chart.options.plugins.legend.labels.generateLabels!(this.parent.chart).filter(
               l => l.text && !this.skipedDatasetLabels.includes(l.text)
            ),
            l => (l.text.startsWith('#') ? l.datasetIndex - 1 : l.datasetIndex)
         );
         keys(groupedByOrder).forEach(k => {
            const items = groupedByOrder[k];
            const set = this.parent.chart.data.datasets[items[0].datasetIndex] as unknown as DatasetModel;
            this.labels.push({
               name: k,
               items: items,
               type: set?.legendStyle || 'line',
               active: this.hiddenLabels.indexOf(k) === -1 && !items[0].hidden,
               datasetIndex: items[0]?.datasetIndex,
               position: this.parent.chart.scales[set.yAxisID || '-1']?.position as string,
               priority: set.legendPriority
            });
         });
         this.labels = orderBy(this.labels, l => l.priority, 'desc');
         this.detector.detectChanges();
      }
   };

   labelClicked(item: LegendItemModel): void {
      item.items.forEach(i => {
         this.parent.chart.setDatasetVisibility(i.datasetIndex, !this.parent.chart.isDatasetVisible(i.datasetIndex));
      });
      item.active
         ? this.hiddenLabels.push(item.name)
         : (this.hiddenLabels = this.hiddenLabels.filter(l => l !== item.name));
      this.parent.updateChart();
   }

   observeResetDatasetsVisibilityTrigger(): Subscription {
      return this.resetDatasetsVisibilityTrigger.subscribe(() => {
         this.hiddenLabels = [];
      });
   }

   getFillStyle(item: LegendItemModel): string | CanvasGradient | CanvasPattern {
      if (!item?.items?.length) return '';
      switch (item.type) {
         case 'triangle':
            return `border-color: transparent transparent ${item.items[0].fillStyle} transparent`;
         case 'band':
            if (item.items.length !== 2) return '';
            return `background-image: linear-gradient(270deg, ${item.items[1].fillStyle} 0%, ${item.items[0].fillStyle} 50%, ${item.items[1].fillStyle} 100%)`;
         case 'circle':
            const border = item.items[0].strokeStyle ? `border: 2px solid ${item.items[0].strokeStyle};` : ``;
            return `background: ${item.items[0].fillStyle}; ${border}`;
         default:
            return `background: ${item.items[0].fillStyle}`;
      }
   }
}
