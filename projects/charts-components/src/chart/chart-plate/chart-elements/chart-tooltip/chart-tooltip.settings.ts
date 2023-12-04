import { ChartTooltipGetModel } from '../../../models';

export class ChartTooltipSettings {
  skipDatasets: string[] = [];

  public static copy(model: ChartTooltipSettings): ChartTooltipSettings {
    const result = new ChartTooltipSettings();
    result.content = model.content;
    result.skipDatasets = model.skipDatasets;
    return result;
  }

  content: (data: ChartTooltipGetModel) => string | null | undefined = (d) => '';

  public isSame(model: ChartTooltipSettings): boolean {
    if (this.content !== model.content) return false;
    return this.skipDatasets === model.skipDatasets;
  }

  public setSkipDatasets(value: string[]): ChartTooltipSettings {
    const result = ChartTooltipSettings.copy(this);
    result.skipDatasets = value;
    return result;
  }

  public setContent(value: (data: ChartTooltipGetModel) => string | null | undefined): ChartTooltipSettings {
    const result = ChartTooltipSettings.copy(this);
    result.content = value;
    return result;
  }
}
