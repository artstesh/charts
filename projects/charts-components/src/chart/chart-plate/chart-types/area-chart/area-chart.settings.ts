import { ChartTypeSettings } from '../models/chart-type.settings';
import { Direction } from '../../../models';

export class AreaChartSettings extends ChartTypeSettings<AreaChartSettings> {
  colors: string[] = ['#1a9be1'];
  direction: Direction = Direction.LeftRight;
  tension: number = 0.6;

  public setDirection(direction: Direction): AreaChartSettings {
    return this.copy({ ...this, direction });
  }

  public setTension(tension: number): AreaChartSettings {
    return this.copy({ ...this, tension });
  }

  public setColors(colors: string[]): AreaChartSettings {
    return this.copy({ ...this, colors });
  }

  protected _isSame(model: AreaChartSettings): boolean {
    if (this.colors !== model.colors) return false;
    if (this.direction !== model.direction) return false;
    if (this.tension !== model.tension) return false;
    return true;
  }

  protected _copy(model: AreaChartSettings): AreaChartSettings {
    const result = new AreaChartSettings();
    result.direction = model.direction;
    result.tension = model.tension;
    result.colors = model.colors;
    return result;
  }
}
