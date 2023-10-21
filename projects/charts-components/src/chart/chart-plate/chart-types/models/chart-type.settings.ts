export abstract class ChartTypeSettings {
  public order: number = 0;
  public name: string = '';
  public color: string = '';

  public abstract isSame(settings: ChartTypeSettings): boolean;
}
