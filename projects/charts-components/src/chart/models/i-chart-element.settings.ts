export interface IChartElementSettings<T> {
  isSame(model: T): boolean;

  copy(model: T): T;
}
