import { PostboyExecutor } from '@artstesh/postboy';
import { Direction } from '../../models';
import Chart from 'chart.js/auto';

export class GetGradientExecutor extends PostboyExecutor<CanvasGradient | null> {
  public static readonly ID = 'c826c171-b7d8-40a8-a8af-cc2241e3fe66';

  constructor(public chart: Chart | null, public colors: string[], public direction: Direction) {
    super();
  }

  public get id(): string {
    return GetGradientExecutor.ID;
  }
}
