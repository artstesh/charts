import { ChartTypeSettings } from '../models/chart-type.settings';

export class BubbleChartSettings extends ChartTypeSettings<BubbleChartSettings> {
  borderColor: string = 'transparent';

  public setBorderColor(borderColor: string): BubbleChartSettings {
    return this.copy({ ...this, borderColor });
  }

  protected _isSame(model: BubbleChartSettings): boolean {
    if (this.borderColor !== model.borderColor) return false;
    return true;
  }

  protected _copy(model: BubbleChartSettings): BubbleChartSettings {
    const result = new BubbleChartSettings();
    result.borderColor = model.borderColor;
    return result;
  }
}
