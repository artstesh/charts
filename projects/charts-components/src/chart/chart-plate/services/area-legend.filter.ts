import { LegendItem } from 'chart.js';
import { ChartConstants } from '../../models/chart-constants';

export class AreaLegendFilter {
  public static check(item: LegendItem): boolean {
    return !!item.text && !item.text.startsWith(ChartConstants.AreaMatePrefix);
  }
}
