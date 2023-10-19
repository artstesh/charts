export class ChartAxisLimitsModel {
  public constructor(
    public minX?: number | null,
    public maxX?: number | null,
    public minY?: number | null,
    public maxY?: number | null,
  ) {}

  public isTheSame(model?: ChartAxisLimitsModel | null): boolean {
    if (!model) return false;
    return model.maxX === this.maxX && model.minX === this.minX && model.minY === this.minY && model.maxY === this.maxY;
  }

  public contains(x: number, y: number): boolean {
    if ((this.maxX != null && x > this.maxX)) return false;
    if ((this.minX != null && x < this.minX)) return false;
    if ((this.maxY != null && y > this.maxY)) return false;
    if ((this.minY != null && y < this.minY)) return false;
    return true;
  }
}
