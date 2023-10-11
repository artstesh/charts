import {ChartDataModel} from "./chart-data.model";

export class ChartSeriesModel {
   constructor(public name: string = '', public data: ChartDataModel[] = [], public color?: string) {}
}
