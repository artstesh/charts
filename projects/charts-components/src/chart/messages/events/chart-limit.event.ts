import { PostboyGenericMessage } from '@artstesh/postboy';
import { ChartAxisLimitsModel } from '../../models/chart-axis-limits.model';

export class ChartLimitEvent extends PostboyGenericMessage {
  public static readonly ID = 'fe753b94-7cfe-463f-912a-e6cfadc632c7';

  constructor(public limits: ChartAxisLimitsModel) {
    super();
    console.log(limits);
  }

  public get id(): string {
    return ChartLimitEvent.ID;
  }
}
