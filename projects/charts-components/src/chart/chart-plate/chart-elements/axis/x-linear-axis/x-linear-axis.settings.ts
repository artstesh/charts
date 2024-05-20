export class XLinearAxisSettings {
  displayGrid: boolean = false;
  maxRotation: number = 90;

  public static copy(model: XLinearAxisSettings): XLinearAxisSettings {
    const result = new XLinearAxisSettings();
    result.maxRotation = model.maxRotation;
    result.displayGrid = model.displayGrid;
    return result;
  }

  public isSame(model: XLinearAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.maxRotation === model.maxRotation;

  }

  public setDisplayGrid(value: boolean): XLinearAxisSettings {
    const result = XLinearAxisSettings.copy(this);
    result.displayGrid = value;
    return result;
  }

  public setMaxRotation(maxRotation: number| null): XLinearAxisSettings {
    return XLinearAxisSettings.copy({ ...this, maxRotation });
  }
}
