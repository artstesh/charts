export class XTimelineAxisSettings {
  limits: [number | null, number | null] = [null, null];
  displayGrid: boolean = false;
  locale: string = 'en';
  dateFormat: Intl.DateTimeFormatOptions = {};

  public isSame(model: XTimelineAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.limits![0] === model.limits![0] && this.limits![1] === model.limits![1];
  }

  public setDisplayGrid(value: boolean): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.displayGrid = value;
    return result;
  }

  public setLocale(value: string): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.locale = value;
    return result;
  }

  public setDateFormat(value: Intl.DateTimeFormatOptions): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.dateFormat = value;
    return result;
  }

  public setLimits(value: [number | null, number | null]): XTimelineAxisSettings {
    const result = XTimelineAxisSettings.copy(this);
    result.limits = value;
    return result;
  }

  public static copy(model: XTimelineAxisSettings): XTimelineAxisSettings {
    const result = new XTimelineAxisSettings();
    result.limits = model.limits;
    result.displayGrid = model.displayGrid;
    result.locale = model.locale;
    result.dateFormat = model.dateFormat;
    return result;
  }
}
