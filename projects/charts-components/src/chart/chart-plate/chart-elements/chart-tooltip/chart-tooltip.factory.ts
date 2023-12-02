import { Chart, ChartTypeRegistry, TooltipItem, TooltipModel, TooltipOptions } from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { ChartDataModel, ChartTooltipGetModel } from "../../../models";
import { ChartTooltipSettings } from "./chart-tooltip.settings";
import { IChartDataset } from "../../chart-types/models/i-chart-dataset";

export class ChartTooltipFactory {
  public static build(
    settings: ChartTooltipSettings
  ): _DeepPartialObject<TooltipOptions<keyof ChartTypeRegistry>> | undefined {
    return {
      position: "nearest", enabled: false,
      external: (context: { chart: Chart; tooltip: TooltipModel<any> }) =>
        this.externalTooltipHandler(context.chart, context.tooltip,settings),
        filter: (e) => !!e.dataset.label && !settings.skipDatasets.includes(e.dataset.label)
    };
  }

  private static externalTooltipHandler(chart: Chart, tooltip: TooltipModel<any>,settings: ChartTooltipSettings): void {
    const tooltipEl = ChartTooltipFactory.getOrCreateTooltip(chart);
    if (!tooltipEl) return;
    tooltipEl.style.opacity = '0';
    tooltipEl.style.zIndex = '-1';
    const points = tooltip.dataPoints?.filter(p => !!p.dataset?.label);

    if (tooltip.opacity !== 0 && points?.length) {
      tooltipEl.style.opacity = '1';
      tooltipEl.style.zIndex = '1';
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

      const eventPositionY = (tooltip as any)._eventPosition.y;
      let nearestPoint = points[0];
      let color = tooltip.labelColors[0]?.backgroundColor;
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (Math.abs(nearestPoint.element.y - eventPositionY) > Math.abs(point.element.y - eventPositionY)) {
          nearestPoint = point;
          color = tooltip.labelColors[i]?.backgroundColor;
        }
      }
      tooltipEl.style.backgroundColor = settings.color === 'auto' && typeof color === 'string' ? color : settings.color;
      const rowPointData = nearestPoint.raw as ChartDataModel;
      const model: ChartTooltipGetModel = {
        y: rowPointData.y,
        x: rowPointData.x,
        label: nearestPoint?.dataset?.label,
        datasetId: (nearestPoint?.dataset as IChartDataset)?.id
      };
      const existing = document.querySelector('.lib-chart-tooltip-content');
      let htmlDivElement = !!existing ? existing : document.createElement("div");
      htmlDivElement.className = 'lib-chart-tooltip-content';
      htmlDivElement.innerHTML = settings.content(model) ?? '';
      tooltipEl.appendChild(htmlDivElement)
      let offset = tooltip.caretX;
      if (offset < tooltip.width / 2) {
        offset = tooltip.width / 2 + 15;
      } else if (tooltip.caretX > chart.width - tooltip.width / 2) {
        offset = chart.width - tooltip.width / 2 + 30;
      }

      tooltipEl.style.left = positionX + offset + 'px';
      tooltipEl.style.top = positionY + nearestPoint.element.y - tooltipEl.offsetHeight * 1.5 + 'px';
      tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    }
  }

  static getOrCreateTooltip(chart: Chart): HTMLDivElement | undefined {
    let tooltipEl = chart.canvas.parentNode?.querySelector("div");
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "transparent";
      tooltipEl.style.opacity = "1";
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
      chart.canvas.parentNode?.appendChild(tooltipEl);
    }
    return tooltipEl;
  }
}
