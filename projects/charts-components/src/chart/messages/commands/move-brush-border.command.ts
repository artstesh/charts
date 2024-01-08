import { PostboyGenericMessage } from '@artstesh/postboy';
import Chart from 'chart.js/auto';

export class MoveBrushBorderCommand extends PostboyGenericMessage {
  public static readonly ID = 'cdd1c3c6-e616-4da9-83c6-7f3ee25be959';
  public get id(): string {
    return MoveBrushBorderCommand.ID;
  }
  constructor(public shift: number, public side: 'left' | 'right') {
    super();
  }
}
