import { PostboyGenericMessage } from '@artstesh/postboy';

export class ZoomAreaCommand extends PostboyGenericMessage {
  public static readonly ID = '351ef1ca-5fa9-4650-8fd2-f33918a8a37e';

  constructor(public range: number) {
    super();
  }
}
