import { ChartData, LegendItem, LegendOptions } from 'chart.js';
import { ChartLegendSettings } from './chart-legend.settings';
import { AreaLegendFilterExecutor } from '../../../../messages/executors/area-legend-filter.executor';
import { ChartPostboyService } from '../../../../services/chart-postboy.service';

export class ChartLegendFactory {
  public static build(settings: ChartLegendSettings, postboy: ChartPostboyService): LegendOptions<any> {
    return {
      display: true,
      position: settings.position,
      align: settings.align,
      labels: {
        filter(item: LegendItem, data: ChartData): boolean {
          return postboy.execute(new AreaLegendFilterExecutor(item));
        },
      },
    } as LegendOptions<any>;
  }
}
