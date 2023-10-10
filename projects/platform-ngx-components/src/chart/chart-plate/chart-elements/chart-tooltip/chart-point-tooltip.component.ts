import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   ComponentFactory,
   ComponentFactoryResolver,
   ElementRef,
   Input,
   OnDestroy,
   OnInit,
   ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartPlateComponent } from '@cdk/chart/chart-plate/chart-plate.component';
import { Chart, ChartTypeRegistry, Color, TooltipItem, TooltipModel } from 'chart.js';
import { ChartDataModel } from '@cdk/chart/chart-plate/models';
import { TooltipDataModel, TooltipContentComponent, TooltipContentHostDirective, TooltipContentModel } from './';
import { DefaultTooltipContentComponent } from './default-tooltip-content/default-tooltip-content.component';
import moment from 'moment';

@Component({
   selector: 'ap-chart-tooltip',
   templateUrl: './chart-point-tooltip.component.html',
   styleUrls: ['./chart-point-tooltip.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartPointTooltipComponent implements OnInit, OnDestroy {
   @Input() enabled = true;
   @Input() position: 'average' | 'nearest' = 'nearest';
   @Input() datasetsWithCustomTooltip?: TooltipContentModel;
   @Input() skipDatasets: string[] = [];
   @Input('color') externalColor = '';
   @ViewChild(TooltipContentHostDirective, { static: true }) contentHostDirective!: TooltipContentHostDirective;
   @ViewChild('tooltip') tooltip!: ElementRef;
   color?: string | CanvasPattern | CanvasGradient;
   private chartSub?: Subscription;

   constructor(
      private parent: ChartPlateComponent,
      private detector: ChangeDetectorRef,
      private componentFactoryResolver: ComponentFactoryResolver
   ) {}

   ngOnInit() {
      if (this.externalColor) this.color = this.externalColor;
      this.chartSub = this.parent.chartInitialized.subscribe(() => this.setTooltip());
   }

   ngOnDestroy(): void {
      this.chartSub?.unsubscribe();
      this.eliminateTip();
   }

   private setTooltip(): void {
      if (!this.parent?.chart?.options?.plugins) return;
      this.parent.chart.options.plugins.tooltip = {
         enabled: !this.enabled,
         position: this.position,
         external: (context: { chart: Chart; tooltip: TooltipModel<any> }) =>
            this.externalTooltipHandler(context.chart, context.tooltip),
         filter: this.tooltipFilter.bind(this)
      };
      this.parent.updateChart();
   }

   private eliminateTip(): void {
      if (!this.parent?.chart?.options?.plugins) return;
      this.parent.chart.options.plugins.tooltip = {};
   }

   private externalTooltipHandler(chart: Chart, tooltip: TooltipModel<any>): void {
      const tooltipEl = this.tooltip.nativeElement as HTMLElement;
      tooltipEl.style.opacity = '0';
      tooltipEl.style.zIndex = '-1';
      const points = tooltip.dataPoints?.filter(p => !!p.dataset?.label);

      if (tooltip.opacity !== 0 && points?.length) {
         tooltipEl.style.opacity = '1';
         tooltipEl.style.zIndex = '1';
         const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

         const eventPositionY = (tooltip as any)._eventPosition.y;
         let neastedPoint = points[0];
         let color = tooltip.labelColors[0]?.backgroundColor;
         for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (Math.abs(neastedPoint.element.y - eventPositionY) > Math.abs(point.element.y - eventPositionY)) {
               neastedPoint = point;
               color = tooltip.labelColors[i]?.backgroundColor;
            }
         }
         const rowPointData = neastedPoint.raw as ChartDataModel;
         const tooltipShift = neastedPoint.dataset?.tooltipShift ?? 0;
         const model = {
            value: rowPointData.y,
            date: moment(rowPointData.x).add(tooltipShift,'day').toDate(),
            label: this.removeUtilityCharacters(neastedPoint?.dataset?.label)
         };
         this.loadContentComponent(model, neastedPoint?.dataset?.label, color, tooltip);
         let offset = tooltip.caretX;
         if (offset < tooltip.width / 2) {
            offset = tooltip.width / 2 + 15;
         } else if (tooltip.caretX > chart.width - tooltip.width / 2) {
            offset = chart.width - tooltip.width / 2 + 30;
         }

         tooltipEl.style.left = positionX + offset + 'px';
         tooltipEl.style.top = positionY + neastedPoint.element.y - tooltipEl.offsetHeight * 1.5 + 'px';
         tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
         this.detector.detectChanges();
      }
   }

   private removeUtilityCharacters(label: string): string {
      return label.startsWith('#') ? label.split('#').join('') : label;
   }

   private loadContentComponent(
      model: TooltipDataModel,
      label: string,
      defaultColor: Color,
      tooltip: TooltipModel<any>
   ) {
      const viewContainerRef = this.contentHostDirective.viewContainerRef;
      viewContainerRef.clear();
      let factory: ComponentFactory<TooltipContentComponent>;
      if (!this.datasetsWithCustomTooltip || !Object.keys(this.datasetsWithCustomTooltip).includes(label)) {
         factory = this.componentFactoryResolver.resolveComponentFactory(DefaultTooltipContentComponent);
         this.color = !this.externalColor ? defaultColor : this.externalColor;
      } else {
         factory = this.componentFactoryResolver.resolveComponentFactory(
            this.datasetsWithCustomTooltip[label].externalContentHandler
         );
         if (this.datasetsWithCustomTooltip[label].tooltipColorOverride) {
            this.color = this.datasetsWithCustomTooltip[label].tooltipColorOverride;
         }
      }
      const componentRef = viewContainerRef.createComponent<TooltipContentComponent>(factory);
      componentRef.instance.data = model;
   }

   private tooltipFilter(e: TooltipItem<keyof ChartTypeRegistry>): boolean {
      if (!this.skipDatasets.length) return true;
      if (e.dataset.label && !this.skipDatasets.includes(e.dataset.label)) return true;
      return false;
   }
}
