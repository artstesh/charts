import { GridLineOptions, ScaleOptionsByType } from 'chart.js';

export class XLinearAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;

  public isSame(model: XLinearAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }

  public setDisplayGrid(value: boolean): this {
    this.displayGrid = value;
    return this;
  }

  public setLimits(value: [number | null, number | null]): this {
    this.limits = value;
    return this;
  }

  public copy(model: XLinearAxisSettings): XLinearAxisSettings {
    return new XLinearAxisSettings().setLimits(model.limits).setDisplayGrid(model.displayGrid);
  }
}
