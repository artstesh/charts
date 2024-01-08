import { Injectable } from '@angular/core';
import { ChartAxisLimitsModel, IChartAxisLimitsModel } from '../models/chart-axis-limits.model';
import { ReplaySubject } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ChartDataModel } from '../models';
import { IPostboyDependingService } from '@artstesh/postboy';
import { ChartPostboyService } from './chart-postboy.service';

@Injectable()
export class ChartAxisLimitService implements IPostboyDependingService {
  private _limitsChanged = new ReplaySubject<ChartAxisLimitsModel>(1);
  public changed = this._limitsChanged.pipe(
    auditTime(50),
    distinctUntilChanged((x, y) => x?.isTheSame(y) ?? false),
    map(() => undefined),
  );

  constructor(private postboy: ChartPostboyService) {}

  up(): void {
  }

  private _model: ChartAxisLimitsModel = new ChartAxisLimitsModel();

  public get model(): IChartAxisLimitsModel {
    return this._model.rawData;
  }

  public setModel(model: ChartAxisLimitsModel | null) {
    this._model = model ?? new ChartAxisLimitsModel();
  }

  public setHorizontalLimits(minX: number | null, maxX: number | null): void {
    this._model.minX = minX;
    this._model.maxX = maxX;
    this._limitsChanged.next(this._model);
  }

  public examine(data: ChartDataModel[]): ChartDataModel[] {
    const result: ChartDataModel[] = [];
    for (let datum of data ?? []) {
      if (!this._model.contains(datum)) continue;
      result.push(datum);
    }
    return result;
  }
}
