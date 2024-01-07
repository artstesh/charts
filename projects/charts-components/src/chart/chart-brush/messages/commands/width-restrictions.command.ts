import { PostboyGenericMessage } from '@artstesh/postboy';

export class WidthRestrictionsCommand extends PostboyGenericMessage {
  public static readonly ID = 'd51defee-b0a0-4215-8c4d-09f682657418';

  constructor(public max: number, public min = 100) {
    super();
  }

  public get id(): string {
    return WidthRestrictionsCommand.ID;
  }
}
