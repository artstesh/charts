import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { InnerPostboyService } from './inner-postboy.service';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { ChartPlateService } from '../chart-plate/services/chart-plate.service';
import { auditTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { GetGradientExecutor } from '../messages/executors/get-gradient.executor';
import { GradientBuilder } from '../utils/gradient.builder';
import { BuildAreaChartExecutor } from '../messages/executors/build-area-chart.executor';
import { AreaChartFactory } from '../chart-plate/chart-types/area-chart/area-chart.factory';
import { AreaBuilderModel } from '../chart-plate/chart-types/models/area-builder.model';
import { AreaLegendFilterExecutor } from '../messages/executors/area-legend-filter.executor';
import { AreaLegendFilter } from '../chart-plate/services/area-legend.filter';
import { ChartRenderedEvent } from '../messages/events/chart-rendered.event';
import { BuildBubbleChartExecutor } from '../messages/executors/build-bubble-chart.executor';
import { BubbleChartFactory } from '../chart-plate/chart-types/bubble-chart/bubble-chart.factory';
import { IChartDataset } from '../chart-plate/chart-types/models/i-chart-dataset';
import { BubbleDataModel } from '../models/bubble-data.model';
import { ChartDataEvent } from '../messages/events/chart-data.event';
import { ChartScrollEvent } from '../messages/events/chart-scroll.event';
import { ToggleGraphVisibilityCommand } from '../messages/commands/toggle-graph-visibility.command';
import { GraphVisibilityService } from '../chart-plate/services/graph-visibility.service';

@Injectable()
export class InnerMessageRegistrator extends PostboyAbstractRegistrator {
  constructor(postboy: InnerPostboyService, general: ChartPlateService, vis: GraphVisibilityService) {
    super(postboy);
    this.registerServices([general, vis]);
  }

  protected _up(): void {
    this.registerReplay<ChartInitializedEvent>(ChartInitializedEvent.ID);
    this.registerReplay<ChartRenderedEvent>(ChartRenderedEvent.ID);
    this.registerReplay<ChartDataEvent>(ChartDataEvent.ID);
    this.registerSubject<ChartScrollEvent>(ChartScrollEvent.ID);
    this.registerSubject<ToggleGraphVisibilityCommand>(ToggleGraphVisibilityCommand.ID);
    this.registerWithPipe<ChartUpdateCommand>(ChartUpdateCommand.ID, new Subject<ChartUpdateCommand>(), (s) =>
      s.pipe(auditTime(350)),
    );
    this.registerExecutor<GetGradientExecutor, CanvasGradient | null>(GetGradientExecutor.ID, (e) =>
      GradientBuilder.build(e.chart, e.colors, e.direction),
    );
    this.registerExecutor<BuildAreaChartExecutor, AreaBuilderModel>(BuildAreaChartExecutor.ID, (e) =>
      AreaChartFactory.build(e.settings, e.data, e.color),
    );
    this.registerExecutor<AreaLegendFilterExecutor, boolean>(AreaLegendFilterExecutor.ID, (e) =>
      AreaLegendFilter.check(e.item),
    );
    this.registerExecutor<BuildBubbleChartExecutor, IChartDataset<'bubble', BubbleDataModel[]>>(
      BuildBubbleChartExecutor.ID,
      (e) => BubbleChartFactory.build(e.settings, e.data),
    );
  }
}
