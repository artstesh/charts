import { PostboyGenericMessage } from '@artstesh/postboy';

export class ChartUpdateCommand extends PostboyGenericMessage {
  public static readonly ID = '602ebd8b-32df-4b58-a4f9-21453307a0ee';
  public get id(): string {
    return ChartUpdateCommand.ID;
  }
  constructor(public force = false) {
    super();
  }
}
