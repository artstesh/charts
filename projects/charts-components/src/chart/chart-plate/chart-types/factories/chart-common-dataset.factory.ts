import { ChartDataset } from "chart.js";
import { ChartDataModel } from "../../../models";

export type ChartElementType = 'line' | 'bar';

export abstract class ChartCommonDatasetFactory {
  protected dataset: ChartDataset = {data: []};

  public constructor(type: ChartElementType, label: string, data: ChartDataModel[]) {
    this.dataset.type = type;
    this.dataset.data = data as any;
    this.dataset.label = label;
  }

  public order(order: number): this {
    this.dataset.order = order;
    return this;
  }

  public backColor(color: string): this {
    this.dataset.backgroundColor = color;
    return this;
  }

  public build = (): ChartDataset => this.dataset;
}
