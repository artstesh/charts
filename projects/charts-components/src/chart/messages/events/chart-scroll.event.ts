import { PostboyGenericMessage } from '@artstesh/postboy';

export class ChartScrollEvent extends PostboyGenericMessage {
  public static readonly ID = 'c8713e5d-b1c4-4543-8228-2db114aaeb72';
  public get id(): string {
    return ChartScrollEvent.ID;
  }
  constructor(public direction: 'up' | 'down') {
    super();
  }
}
