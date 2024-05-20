import { PostboyGenericMessage } from '@artstesh/postboy';
import { ChartAreaDataModel, ChartDataModel } from '../../models';

export class ChartDataEvent extends PostboyGenericMessage {
  public static readonly ID = 'bd5abb03-d58d-4079-8909-652d8d268a91';
  public get id(): string {
    return ChartDataEvent.ID;
  }
  constructor(public data: (ChartDataModel | ChartAreaDataModel)[]) {
    super();
  }
}
