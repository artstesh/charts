import { LegendItem } from 'chart.js';

export interface LegendItemModel {
  type?: 'triangle' | 'band' | 'line' | 'bar' | 'circle';
  name: string;
  items: LegendItem[];
  active: boolean;
  datasetIndex: number;
  position: string;
  priority: number;
}
