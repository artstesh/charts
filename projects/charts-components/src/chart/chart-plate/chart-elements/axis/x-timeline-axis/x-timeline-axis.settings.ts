export type DateUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export class XTimelineAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;
  dateUnit: DateUnit = 'day';
  maxRotation: number = 90;

  public static copy(model: XTimelineAxisSettings): XTimelineAxisSettings {
    const result = new XTimelineAxisSettings();
    result.limits = model.limits;
    result.displayGrid = model.displayGrid;
    result.dateUnit = model.dateUnit;
    result.maxRotation = model.maxRotation;
    result.dateFormat = model.dateFormat;
    return result;
  }

  dateFormat: (milliseconds: number, index: number) => string = (m: number, i: number) =>
    new Date(m).toLocaleString('en', { month: '2-digit', year: '2-digit', day: '2-digit' });

  public isSame(model: XTimelineAxisSettings): boolean {
    if (this.maxRotation !== model.maxRotation) return false;
    if (this.displayGrid !== model.displayGrid) return false;
    if (this.dateUnit !== model.dateUnit) return false;
    const date = new Date().getTime();
    if (this.dateFormat(date, 0) !== model.dateFormat(date, 0)) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }

  public setDisplayGrid(value: boolean): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.displayGrid = value;
    return result;
  }

  public setDateUnit(value: DateUnit): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.dateUnit = value;
    return result;
  }

  public setMaxRotation(maxRotation: number| null): XTimelineAxisSettings {
    return XTimelineAxisSettings.copy({ ...this, maxRotation });
  }

  public setDateFormat(value: (milliseconds: number, index: number) => string): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.dateFormat = value;
    return result;
  }

  public setLimits(value: [number | null, number | null]): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.limits = value;
    return result;
  }
}
