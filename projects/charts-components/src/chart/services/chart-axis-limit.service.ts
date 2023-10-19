import { Injectable } from '@angular/core';
import { ChartAxisLimitsModel } from "../models/chart-axis-limits.model";
import { ReplaySubject } from "rxjs";
import { auditTime, distinctUntilChanged, map } from "rxjs/operators";

@Injectable()
export class ChartAxisLimitService {
  private _limitsChanged = new ReplaySubject<ChartAxisLimitsModel>(1);
  public changed = this._limitsChanged.pipe(
    auditTime(50),
    distinctUntilChanged((x,y) => x?.isTheSame(y) ?? false),
    map(() => undefined)
  );
  private readonly model: ChartAxisLimitsModel;

  constructor(model: ChartAxisLimitsModel | null = null) {
    this.model = model ?? new ChartAxisLimitsModel();
  }

  public setHorizontalLimits(minX: number | null, maxX: number | null): void {
    this.model.minX = minX;
    this.model.maxX = maxX;
    this._limitsChanged.next(this.model);
  }

  public setMainVerticalLimits(min: number | null, max: number | null): void {
    this.model.minY = min;
    this.model.maxY = max;
    this._limitsChanged.next(this.model);
  }

  public examine(x: number, y: number): boolean {
    return this.model.contains(x, y);
  }
}
