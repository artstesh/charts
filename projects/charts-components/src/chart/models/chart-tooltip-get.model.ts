import { ChartDataModel } from './chart-data.model';

export interface ChartTooltipGetModel {
  value: ChartDataModel | number | undefined;
  datasetId: string;
}
