import { ChartDataset } from 'chart.js';

export interface DatasetModel extends ChartDataset<any> {
   legendStyle: 'triangle' | 'band' | 'line' | 'bar';
   yAxisID?: string;
   legendPriority: number;
}
