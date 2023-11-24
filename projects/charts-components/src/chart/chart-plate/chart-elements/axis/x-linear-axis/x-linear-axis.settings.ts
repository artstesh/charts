export class XLinearAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;

  public isSame(model: XLinearAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }

  public setDisplayGrid(value: boolean): XLinearAxisSettings {
    const result = XLinearAxisSettings.copy(this);
    result.displayGrid = value;
    return result;
  }

  public setLimits(value: [number | null, number | null]): XLinearAxisSettings {
    const result = XLinearAxisSettings.copy(this);
    result.limits = value;
    return result;
  }

  public static copy(model: XLinearAxisSettings): XLinearAxisSettings {
    const result = new XLinearAxisSettings();
    result.limits = model.limits;
    result.displayGrid = model.displayGrid;
    return result;
  }
}
