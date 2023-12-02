export type DateUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export class XTimelineAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;
  dateUnit: DateUnit = 'day';

  public static copy(model: XTimelineAxisSettings): XTimelineAxisSettings {
    const result = new XTimelineAxisSettings();
    result.limits = model.limits;
    result.displayGrid = model.displayGrid;
    result.dateUnit = model.dateUnit;
    result.dateFormat = model.dateFormat;
    return result;
  }

  dateFormat: (milliseconds: number, index: number) => string = (m: number, i: number) =>
    new Date(m).toLocaleString('en', { month: '2-digit', year: '2-digit', day: '2-digit' });

  public isSame(model: XTimelineAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    if (this.dateUnit !== model.dateUnit) return false;
    if (this.dateFormat !== model.dateFormat) return false;
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
