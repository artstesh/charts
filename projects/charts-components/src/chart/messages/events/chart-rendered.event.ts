import { PostboyGenericMessage } from '@artstesh/postboy';

export class ChartRenderedEvent extends PostboyGenericMessage {
  public static readonly ID = 'b5f4ba9b-4dbc-42e7-9a28-95aee88e397a';

  constructor() {
    super();
  }

  public get id(): string {
    return ChartRenderedEvent.ID;
  }
}
