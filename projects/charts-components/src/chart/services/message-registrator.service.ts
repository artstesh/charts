import { Injectable } from '@angular/core';
import { PostboyAbstractRegistrator } from '@artstesh/postboy';
import { ChartPostboyService } from './chart-postboy.service';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { ChartPlateService } from '../chart-plate/services/chart-plate.service';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { ChartLimitEvent } from '../messages/events/chart-limit.event';
import { FilterDatasetQuery } from '../messages/queries/filter-dataset.query';
import { ChartAxisLimitService } from './chart-axis-limit.service';
import { ChartDataModel } from '../models';
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

@Injectable()
export class MessageRegistratorService extends PostboyAbstractRegistrator {
  constructor(postboy: ChartPostboyService, general: ChartPlateService, private limit: ChartAxisLimitService) {
    super(postboy);
    this.registerServices([general, limit]);
  }

  protected _up(): void {
    this.registerReplay<ChartInitializedEvent>(ChartInitializedEvent.ID);
    this.registerReplay<ChartRenderedEvent>(ChartRenderedEvent.ID);
    this.registerSubject<FilterDatasetQuery>(FilterDatasetQuery.ID);
    this.registerSubject<ChartDataEvent>(ChartDataEvent.ID);
    this.registerWithPipe<ChartUpdateCommand>(ChartUpdateCommand.ID, new Subject<ChartUpdateCommand>(), (s) =>
      s.pipe(auditTime(350)),
    );
    this.registerWithPipe<ChartLimitEvent>(ChartLimitEvent.ID, new ReplaySubject<ChartLimitEvent>(1), (s) =>
      s.pipe(
        distinctUntilChanged((x, y) => x?.limits.isTheSame(y?.limits) ?? false),
        auditTime(50),
      ),
    );
    this.registerExecutor<FilterDatasetQuery, ChartDataModel[]>(FilterDatasetQuery.ID, (e) =>
      this.limit.examine(e.collection),
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
