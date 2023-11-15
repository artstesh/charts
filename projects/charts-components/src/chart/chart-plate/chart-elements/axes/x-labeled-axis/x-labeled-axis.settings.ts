import { ChartAxisLabelModel } from "../../../../models/chart-axis-label.model";

export class XLabeledAxisSettings {
  labels: ChartAxisLabelModel[] = [];
  displayGrid: boolean = false;

  public isSame(model: XLabeledAxisSettings): boolean {
    if (this.displayGrid !== model.displayGrid) return false;
    return this.labels === model.labels;
  }

  public setDisplayGrid(value: boolean): XLabeledAxisSettings {
    const result = XLabeledAxisSettings.copy(this);
    result.displayGrid = value;
    return result;
  }

  public setLabels(value: ChartAxisLabelModel[]): XLabeledAxisSettings {
    const result = XLabeledAxisSettings.copy(this);
    result.labels = value;
    return result;
  }

  public static copy(model: XLabeledAxisSettings): XLabeledAxisSettings {
    const result = new XLabeledAxisSettings();
    result.labels = model.labels;
    result.displayGrid = model.displayGrid;
    return result;
  }
}
