import { PostboyExecutor } from '@artstesh/postboy';
import { LegendItem } from 'chart.js';

export class AreaLegendFilterExecutor extends PostboyExecutor<boolean> {
  public static readonly ID = '28a07ac6-acab-4014-b4c0-19bbeefb1485';

  constructor(public item: LegendItem) {
    super();
  }
}
