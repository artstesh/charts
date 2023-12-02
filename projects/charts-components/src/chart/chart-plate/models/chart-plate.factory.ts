import { ChartConfiguration } from 'chart.js';
import { ChartPlateSettings } from './chart-plate.settings';

export class ChartPlateFactory {
  public static build(settings: ChartPlateSettings): ChartConfiguration {
    return {
      type: 'line',
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
          x: {
            type: 'linear',
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
            },
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
