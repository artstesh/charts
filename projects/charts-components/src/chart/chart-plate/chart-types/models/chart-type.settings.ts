import { IChartElementSettings } from '../../../models/i-chart-element.settings';

export abstract class ChartTypeSettings<T extends ChartTypeSettings<T>> implements IChartElementSettings<T> {
  public order: number = 0;
  public name: string = `Unnamed-${Math.round(Math.random() * 9999)}`;
  public color: string = '';
  public yLeft: boolean = true;
  public id: string = `id-${Math.floor(Math.random() * 9999 + 1)}`;

  public isSame(model: T): boolean {
    if (this.order !== model.order) return false;
    if (this.name !== model.name) return false;
    if (this.color !== model.color) return false;
    if (this.yLeft !== model.yLeft) return false;
    if (this.id !== model.id) return false;
    return this._isSame(model);
  }

  public setRight(right = true): T {
    return this.copy({ ...(this as any), yLeft: !right });
  }

  public setOrder(order: number): T {
    return this.copy({ ...(this as any), order });
  }

  public setColor(color: string): T {
    return this.copy({ ...(this as any), color });
  }

  public setName(name: string): T {
    return this.copy({ ...(this as any), name });
  }

  public copy(model: T): T {
    const result = this._copy(model);
    result.order = model.order;
    result.name = model.name;
    result.color = model.color;
    result.yLeft = model.yLeft;
    result.id = model.id;
    return result;
  }

  protected abstract _isSame(model: T): boolean;

  protected abstract _copy(model: T): T;
}
