import { PostboyGenericMessage } from '@artstesh/postboy';

export class MoveBrushCommand extends PostboyGenericMessage {
  public static readonly ID = '747098a6-d1c9-4439-8f3e-8cb2e0a8e84d';

  constructor(public shift: number) {
    super();
  }

  public get id(): string {
    return MoveBrushCommand.ID;
  }
}
