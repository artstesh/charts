import { PostboyExecutor } from '@artstesh/postboy';
import { ChartAreaDataModel } from '../../models';
import { AreaChartSettings } from '../../chart-plate/chart-types/area-chart/area-chart.settings';
import { AreaBuilderModel } from '../../chart-plate/chart-types/models/area-builder.model';

export class BuildAreaChartExecutor extends PostboyExecutor<AreaBuilderModel> {
  public static readonly ID = '69b3ffbf-8683-4914-af1d-68f0a6af5e97';

  constructor(public settings: AreaChartSettings, public data: ChartAreaDataModel[], public color: CanvasGradient) {
    super();
  }

  public get id(): string {
    return BuildAreaChartExecutor.ID;
  }
}
