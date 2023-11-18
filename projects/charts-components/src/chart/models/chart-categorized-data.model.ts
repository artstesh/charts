import { ChartDataModel } from './chart-data.model';

export class ChartCategorizedDataModel implements ChartDataModel {
  x: number;

  constructor(public y: number | null) {
    this.x = 0;
  }
}
