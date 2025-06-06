import { PostboyExecutor } from '@artstesh/postboy';
import { BubbleChartSettings } from '../../chart-plate';
import { BubbleDataModel } from '../../models';
import { IChartDataset } from '../../chart-plate/chart-types/models/i-chart-dataset';

/**
 * The `BuildBubbleChartExecutor` class is responsible for creating and managing the execution context
 * required to build a bubble chart using the provided settings and data.
 *
 * This class extends the generic `PostboyExecutor` specifically for bubble chart datasets and data models.
 */
export class BuildBubbleChartExecutor extends PostboyExecutor<IChartDataset<'bubble', BubbleDataModel[]>> {
  public static readonly ID = '2128c5c1-ea4c-4964-9e74-ad0a11b0089a';

  /**
   * Constructs an instance of the class.
   *
   * @param {BubbleChartSettings} settings - The configuration settings for the bubble chart.
   * @param {BubbleDataModel[]} data - An array of data models representing bubble chart data.
   */
  constructor(public settings: BubbleChartSettings, public data: BubbleDataModel[]) {
    super();
  }
}
