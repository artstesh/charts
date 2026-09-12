import { ChartData, LegendItem, LegendOptions } from 'chart.js';
import { ChartLegendSettings } from './chart-legend.settings';
import { AreaLegendFilterExecutor } from '../../../../messages/executors/area-legend-filter.executor';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';

export class ChartLegendFactory {
  public static build(settings: ChartLegendSettings, postboy: InnerPostboyService): LegendOptions<any> {
    return {
      display: true,
      position: settings.position,
      align: settings.align,
      labels: {
        filter(item: LegendItem, data: ChartData): boolean {
          return postboy.exec(new AreaLegendFilterExecutor(item));
        },
      },
    } as LegendOptions<any>;
  }
}
