import { IChartElementSettings } from '../../../models/i-chart-element.settings';

export abstract class ChartTypeSettings<T extends ChartTypeSettings<T>> implements IChartElementSettings<T> {
  public order: number = 0;
  public name: string = '';
  public color: string = '';
  public yLeft: boolean = false;

  public isSame(model: T): boolean {
    if (this.order !== model.order) return false;
    if (this.name !== model.name) return false;
    if (this.color !== model.color) return false;
    if (this.yLeft !== model.yLeft) return false;
    return this._isSame(model);
  }

  public copy(model: T): T {
    const result = this._copy(model);
    result.order = model.order;
    result.name = model.name;
    result.color = model.color;
    result.yLeft = model.yLeft;
    return result;
  }

  protected abstract _isSame(model: T): boolean;

  protected abstract _copy(model: T): T;
}
