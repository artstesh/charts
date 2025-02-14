// noinspection JSSuspiciousNameCombination
import { ChartConstants } from "../../../models/chart-constants";
import { ChartLineSettings } from "../line-chart/chart-line.settings";
import { ChartDataModel } from "../../../models";
import { IChartDataset } from "../models/i-chart-dataset";

export class ChartLineDatasetFactory {
  public static build(settings: ChartLineSettings, data: ChartDataModel[]): IChartDataset<'line', ChartDataModel[]> {
    return {
      backgroundColor: settings.color,
      borderColor: settings.color,
      data: data,
      id: settings.id,
      label: settings.name,
      order: settings.order,
      pointRadius: settings.pointRadius,
      fill: settings.fill,
      tension: settings.tension,
      type: 'line',
      pointBorderWidth: 0,
      spanGaps: !!settings.segments,
      borderWidth: settings.borderWidth,
      borderDash: settings.borderDash,
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      segment: settings.segments
        ? {
            borderColor: (ctx) => skipped(ctx, settings.color) || down(ctx, settings.color),
            borderDash: (ctx) => skipped(ctx, settings.segments),
          }
        : undefined,
    } as IChartDataset<'line', ChartDataModel[]>;
  }
}
const skipped = (ctx: any, value: any) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);
const down = (ctx: any, value: any) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined);
