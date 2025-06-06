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
import { AreaLegendFilterExecutor } from '../messages/executors/area-legend-filter.executor';
import { AreaLegendFilter } from '../chart-plate/services/area-legend.filter';
import { ChartRenderedEvent } from '../messages/events/chart-rendered.event';
import { BuildBubbleChartExecutor } from '../messages/executors/build-bubble-chart.executor';
import { BubbleChartFactory } from '../chart-plate/chart-types/bubble-chart/bubble-chart.factory';
import { ChartDataEvent } from '../messages/events/chart-data.event';
import { ChartScrollEvent } from '../messages/events/chart-scroll.event';
import { ToggleGraphVisibilityCommand } from '../messages/commands/toggle-graph-visibility.command';
import { GraphVisibilityService } from '../chart-plate/services/graph-visibility.service';
import { BuildScatterChartExecutor } from '../messages/executors/build-scatter-chart.executor';
import { ScatterChartFactory } from '../chart-plate/chart-types/scatter-chart/scatter-chart.factory';

@Injectable()
export class InnerMessageRegistrator extends PostboyAbstractRegistrator {
  constructor(postboy: InnerPostboyService, general: ChartPlateService, vis: GraphVisibilityService) {
    super(postboy);
    this.registerServices([general, vis]);
  }

  protected _up(): void {
    this.recordReplay(ChartInitializedEvent);
    this.recordReplay(ChartRenderedEvent);
    this.recordReplay(ChartDataEvent);
    this.recordSubject(ChartScrollEvent);
    this.recordSubject(ToggleGraphVisibilityCommand);
    this.recordWithPipe(ChartUpdateCommand, new Subject<ChartUpdateCommand>(), (s) => s.pipe(auditTime(350)));
    this.recordExecutor(GetGradientExecutor, (e) => GradientBuilder.build(e.chart, e.colors, e.direction));
    this.recordExecutor(BuildAreaChartExecutor, (e) => AreaChartFactory.build(e.settings, e.data, e.color));
    this.recordExecutor(AreaLegendFilterExecutor, (e) => AreaLegendFilter.check(e.item));
    this.recordExecutor(BuildBubbleChartExecutor, (e) => BubbleChartFactory.build(e.settings, e.data));
    this.recordExecutor(BuildScatterChartExecutor, (e) => ScatterChartFactory.build(e.settings, e.data));
  }
}
