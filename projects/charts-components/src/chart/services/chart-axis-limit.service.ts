import { Injectable } from '@angular/core';
import { ChartAxisLimitsModel, IChartAxisLimitsModel } from "../models/chart-axis-limits.model";
import { ReplaySubject } from "rxjs";
import { auditTime, distinctUntilChanged, map } from "rxjs/operators";
import { ChartDataModel } from "../models";

@Injectable()
export class ChartAxisLimitService {
  private _limitsChanged = new ReplaySubject<ChartAxisLimitsModel>(1);
  public changed = this._limitsChanged.pipe(
    auditTime(50),
    distinctUntilChanged((x,y) => x?.isTheSame(y) ?? false),
    map(() => undefined)
  );
  private _model: ChartAxisLimitsModel = new ChartAxisLimitsModel();

  constructor() {
  }

  public setModel(model: ChartAxisLimitsModel | null) {
    this._model = model ?? new ChartAxisLimitsModel();
  }

  public get model(): IChartAxisLimitsModel {
    return this._model.rawData;
  }

  public setHorizontalLimits(minX: number | null, maxX: number | null): void {
    this._model.minX = minX;
    this._model.maxX = maxX;
    this._limitsChanged.next(this._model);
  }

  public setMainVerticalLimits(min: number | null, max: number | null): void {
    this._model.minY = min;
    this._model.maxY = max;
    this._limitsChanged.next(this._model);
  }

  public examine(data: ChartDataModel[]): ChartDataModel[] {
    const result: ChartDataModel[] = [];
    for (let datum of data) {
      if (!this._model.contains(datum)) continue;
      result.push(datum);
    }
    return result;
  }
}
