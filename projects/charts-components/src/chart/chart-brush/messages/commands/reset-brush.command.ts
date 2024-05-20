import { PostboyGenericMessage } from '@artstesh/postboy';

export class ResetBrushCommand extends PostboyGenericMessage {
  public static readonly ID = 'c178bf7b-e054-4606-998b-c922d6bb5239';
  public get id(): string {
    return ResetBrushCommand.ID;
  }
  constructor() {
    super();
  }
}
