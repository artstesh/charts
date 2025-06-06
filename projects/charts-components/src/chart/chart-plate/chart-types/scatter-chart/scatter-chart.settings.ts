import { ChartTypeSettings } from '../models/chart-type.settings';
import { PointStyle } from 'chart.js/dist/types';

export class ScatterChartSettings extends ChartTypeSettings<ScatterChartSettings> {
  pointStyle?:
    | 'circle'
    | 'cross'
    | 'crossRot'
    | 'dash'
    | 'line'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'star'
    | 'triangle'
    | false
    | HTMLImageElement
    | HTMLCanvasElement = 'circle';
  pointRadius: number = 3;
  pointRotation: number | undefined;

  /**
   * Sets the point style for the scatter chart settings.
   *
   * @param pointStyle The PointStyle object specifying the style of points to be used in the scatter chart.
   * @return A new instance of ScatterChartSettings with the updated point style.
   */
  public setPointStyle(pointStyle: PointStyle): ScatterChartSettings {
    return this.copy({ ...this, pointStyle: pointStyle });
  }

  /**
   * Sets the radius of points in the scatter chart.
   *
   * @param {number} pointRadius - The desired radius for points in the scatter chart.
   * @return {ScatterChartSettings} A new ScatterChartSettings instance with the updated point radius.
   */
  setPointRadius(pointRadius: number): ScatterChartSettings {
    return this.copy({ ...this, pointRadius });
  }

  setPointRotation(pointRotation: number): ScatterChartSettings {
    return this.copy({ ...this, pointRotation });
  }

  protected _isSame(model: ScatterChartSettings): boolean {
    if (this.pointStyle !== model.pointStyle) return false;
    if (this.pointRadius !== model.pointRadius) return false;
    if (this.pointRotation !== model.pointRotation) return false;
    return true;
  }

  protected _copy(model: ScatterChartSettings): ScatterChartSettings {
    const result = new ScatterChartSettings();
    result.pointStyle = model.pointStyle;
    result.pointRadius = model.pointRadius;
    result.pointRotation = model.pointRotation;
    return result;
  }
}
