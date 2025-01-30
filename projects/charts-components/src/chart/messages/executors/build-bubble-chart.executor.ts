import { PostboyExecutor } from '@artstesh/postboy';
import { BubbleChartSettings } from '../../chart-plate';
import { BubbleDataModel } from '../../models';
import { IChartDataset } from '../../chart-plate/chart-types/models/i-chart-dataset';

export class BuildBubbleChartExecutor extends PostboyExecutor<IChartDataset<'bubble', BubbleDataModel[]>> {
  public static readonly ID = '2128c5c1-ea4c-4964-9e74-ad0a11b0089a';

  constructor(public settings: BubbleChartSettings, public data: BubbleDataModel[]) {
    super();
  }
}
