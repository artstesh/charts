import { Direction } from '../models';
import Chart from 'chart.js/auto';
import { ChartConstants } from '../models/chart-constants';

export class GradientBuilder {
  public static build(chart: Chart | null, colors: string[], direction: Direction): CanvasGradient | null {
    if (!chart) return null;
    const length =
      (direction === Direction.LeftRight
        ? chart.scales[ChartConstants.BottomAxisId]?.width
        : chart.scales[ChartConstants.LeftAxisId]?.height) ?? 0;
    const x1 = direction === Direction.LeftRight ? length : 0;
    const y1 = direction === Direction.BottomTop ? length : 0;
    const gradient = chart.ctx.createLinearGradient(0, 0, x1, y1);

    if (!colors.length) colors.push(...['#1a9be1', '#1a9be1']);
    if (colors.length === 1) colors.push(colors[0]);

    colors.forEach((c, i) => gradient.addColorStop(i / colors.length, c));
    return gradient;
  }
}
