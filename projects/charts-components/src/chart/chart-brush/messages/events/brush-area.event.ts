import { PostboyGenericMessage } from '@artstesh/postboy';
import { BrushRangeModel } from '../../models/brush-range.model';

export class BrushAreaEvent extends PostboyGenericMessage {
  public static readonly ID = 'cf329d58-0012-4d8a-988b-9f50d066a6b6';

  constructor(public range: BrushRangeModel) {
    super();
  }

  public get id(): string {
    return BrushAreaEvent.ID;
  }
}
