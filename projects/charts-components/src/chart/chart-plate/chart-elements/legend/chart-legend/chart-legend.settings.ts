export type ChartLegendDirection = 'row' | 'column';
export type ChartLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export class ChartLegendSettings {
  direction: ChartLegendDirection = 'row';
  position: ChartLegendPosition = 'bottom';

  public isSame(model: ChartLegendSettings): boolean {
    if (this.direction !== model.direction) return false;
    return this.position === model.position;
  }

  public setDirection(value: ChartLegendDirection): this {
    this.direction = value;
    return this;
  }

  public setPosition(value: ChartLegendPosition): this {
    this.position = value;
    return this;
  }

  public static copy(model: ChartLegendSettings): ChartLegendSettings {
    return new ChartLegendSettings().setDirection(model.direction).setPosition(model.position);
  }
}
