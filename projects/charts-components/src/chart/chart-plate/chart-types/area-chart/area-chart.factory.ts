import { ChartAreaDataModel } from '../../../models';
import { ChartConstants } from '../../../models/chart-constants';
import { AreaChartSettings } from './area-chart.settings';
import { ChartAreaDataset } from '../models/chart-area-dataset.type';
import { AreaBuilderModel } from '../models/area-builder.model';
import { ChartAreaElementType } from '../models/chart-area-element.type';

export class AreaChartFactory {
  public static build(
    settings: AreaChartSettings,
    data: ChartAreaDataModel[],
    color: CanvasGradient | null,
  ): AreaBuilderModel {
    return {
      top: AreaChartFactory.buildElement(settings, data, color, ChartAreaElementType.Top),
      bottom: AreaChartFactory.buildElement(settings, data, color, ChartAreaElementType.Bottom),
    };
  }

  private static buildElement(
    settings: AreaChartSettings,
    data: ChartAreaDataModel[],
    color: CanvasGradient | null,
    areaType: ChartAreaElementType,
  ): ChartAreaDataset {
    const fill =
      areaType === ChartAreaElementType.Top
        ? false
        : {
            target: '-1',
            below: color,
          };
    return {
      id: areaType === ChartAreaElementType.Top ? settings.id : `${ChartConstants.AreaMatePrefix}${settings.id}`,
      label: areaType === ChartAreaElementType.Top ? settings.name : `${ChartConstants.AreaMatePrefix}${settings.name}`,
      type: 'area',
      fill: fill,
      order: settings.order,
      data: areaType === ChartAreaElementType.Top ? [...data] : data.map((e) => ({ x: e.x, y: e.y2, y2: e.y })),
      tension: settings.tension,
      xAxisID: ChartConstants.BottomAxisId,
      yAxisID: settings.yLeft ? ChartConstants.LeftAxisId : ChartConstants.RightAxisId,
      backgroundColor: color,
      pointRadius: 5,
      borderColor: 'transparent',
      pointStyle: false,
      areaType: areaType,
      mateId: areaType === ChartAreaElementType.Bottom && settings.id,
    } as ChartAreaDataset;
  }
}
