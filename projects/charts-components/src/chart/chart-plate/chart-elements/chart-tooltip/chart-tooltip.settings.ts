import { ChartTooltipGetModel } from "../../../models";

export class ChartTooltipSettings {
  color: string | 'auto' = 'auto';
  skipDatasets: string[] = [];
  content: (data: ChartTooltipGetModel) => string | null | undefined = (d) => null;

  public isSame(model: ChartTooltipSettings): boolean {
    if (this.content !== model.content) return false;
    if (this.skipDatasets !== model.skipDatasets) return false;
    return this.color === model.color;
  }

  public setColor(value: string): ChartTooltipSettings {
    const result = ChartTooltipSettings.copy(this);
    result.color = value;
    return result;
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

  public static copy(model: ChartTooltipSettings): ChartTooltipSettings {
    const result = new ChartTooltipSettings();
    result.color = model.color;
    result.content = model.content;
    result.skipDatasets = model.skipDatasets;
    return result;
  }
}
