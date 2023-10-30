import { ChartConfiguration } from 'chart.js';
import { ChartPlateSettings } from './chart-plate.settings';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class ChartPlateFactory {
  public static build(settings: ChartPlateSettings): ChartConfiguration {
    return {
      type: 'line',
      data: {
        datasets: [],
      },
      plugins: [ChartDataLabels],
      options: {
        interaction: {
          intersect: true,
          mode: settings.interactionMode,
        },
        animation: {
          duration: 300,
        },
        responsive: true,
        plugins: {
          datalabels: {
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
