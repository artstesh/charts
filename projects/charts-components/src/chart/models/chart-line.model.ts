import { ChartDataset } from 'chart.js';

export interface ChartLineModel extends ChartDataset<any> {
   tooltipShift?: number;
}
