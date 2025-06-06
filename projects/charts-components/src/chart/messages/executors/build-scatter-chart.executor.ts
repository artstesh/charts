import { PostboyExecutor } from '@artstesh/postboy';
import { ChartDataModel } from '../../models';
import { IChartDataset } from '../../chart-plate/chart-types/models/i-chart-dataset';
import { ScatterChartSettings } from '../../chart-plate/chart-types/scatter-chart/scatter-chart.settings';

/**
 * Represents an executor for building scatter charts.
 */
export class BuildScatterChartExecutor extends PostboyExecutor<IChartDataset<'scatter', ChartDataModel[]>> {
  public static readonly ID = 'f60099f1-afb4-4e84-868f-eac2e2ae4d1a';

  /**
   * Constructs a new instance of the class.
   *
   * @param {ScatterChartSettings} settings - The configuration settings for the scatter chart.
   * @param {ChartDataModel[]} data - The data model used for the scatter chart.
   */
  constructor(public settings: ScatterChartSettings, public data: ChartDataModel[]) {
    super();
  }
}
