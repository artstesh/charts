import { PostboyCallbackMessage } from '@artstesh/postboy';
import { ChartDataModel } from '../../models';

export class FilterDatasetQuery extends PostboyCallbackMessage<ChartDataModel[]> {
  public static readonly ID = 'eafe8cfa-706e-49fd-9830-39f93ddc8649';

  constructor(public collection: ChartDataModel[]) {
    super();
  }

  public get id(): string {
    return FilterDatasetQuery.ID;
  }
}
