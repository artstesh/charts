import { ChartDataset } from 'chart.js';
import { ChartAreaDataModel } from '../../../models';
import { ChartAreaElementType } from './chart-area-element.type';

export type ChartAreaDataset = ChartDataset<any, ChartAreaDataModel[]> & {
  areaType: ChartAreaElementType;
  id: string;
  mateId?: string;
};
