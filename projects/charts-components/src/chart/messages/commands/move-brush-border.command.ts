import { PostboyGenericMessage } from '@artstesh/postboy';

export class MoveBrushBorderCommand extends PostboyGenericMessage {
  public static readonly ID = 'cdd1c3c6-e616-4da9-83c6-7f3ee25be959';

  constructor(public shift: number, public side: 'left' | 'right') {
    super();
  }

  public get id(): string {
    return MoveBrushBorderCommand.ID;
  }
}
