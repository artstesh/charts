import { ChartConfiguration, ChartData, LegendItem } from 'chart.js';
import { ChartPlateSettings } from './chart-plate.settings';
import { ChartConstants } from '../../models/chart-constants';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { AreaLegendFilterExecutor } from '../../messages/executors/area-legend-filter.executor';
import { ChartRenderedEvent } from '../../messages/events/chart-rendered.event';

export class ChartPlateFactory {
  public static build(settings: ChartPlateSettings, postboy: InnerPostboyService): ChartConfiguration {
    return {
      type: settings.type,
      data: {
        datasets: [],
      },
      options: {
        interaction: {
          axis: 'xy',
          mode: settings.interactionMode,
        },
        animation: {
          duration: 300,
          onComplete: () => postboy.fire(new ChartRenderedEvent()),
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
            labels: {
              filter(item: LegendItem, data: ChartData): boolean {
                return postboy.execute(new AreaLegendFilterExecutor(item));
              },
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          [ChartConstants.BottomAxisId]: {
            type: 'linear',
            grid: {
              display: false,
            },
            offset: true,
          },
          [ChartConstants.LeftAxisId]: {
            offset: true,
          },
        },
        elements: {
          point: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
        },
      },
    };
  }
}
