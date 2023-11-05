import { ChartEvent } from 'chart.js';
import { ChartDataModel } from './';

export interface ChartClickModel {
  data: { [datasetLabel: string]: ChartDataModel };
  event: ChartEvent;
}
