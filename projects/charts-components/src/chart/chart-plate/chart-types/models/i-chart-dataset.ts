import { ChartDataset, ChartType, DefaultDataPoint } from 'chart.js';

export type IChartDataset<T1 extends ChartType = ChartType, T2 = DefaultDataPoint<T1>> = ChartDataset<T1, T2> & {
  id: string;
};
