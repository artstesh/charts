import { PointStyle } from 'chart.js';

export class ChartScatterConfigModel {
  pointRadius: number = 0;
  yAxisId = 'y';
  color?: string;
  pointStyle: PointStyle = 'triangle';
  pointBorderWidth?: number;
  borderColor?: string;
  pointHoverRadius?: number;
  pointHoverBackgroundColor?: string;
  pointHoverBorderWidth?: number;
  pointHitRadius?: number;
  hidden = false;

  constructor(config?: Partial<ChartScatterConfigModel>) {
    if (config) {
      Object.assign(this, config);
    }
  }
}
