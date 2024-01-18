import { ChartConfiguration } from 'chart.js';
import { ChartPlateSettings } from './chart-plate.settings';
import { ChartConstants } from '../../models/chart-constants';

export class ChartPlateFactory {
  public static build(settings: ChartPlateSettings): ChartConfiguration {
    return {
      type: settings.type,
      data: {
        datasets: [],
      },
      //  plugins: [ChartDataLabels],
      options: {
        interaction: {
          axis: 'xy',
          mode: settings.interactionMode,
        },
        animation: {
          duration: 300,
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
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
