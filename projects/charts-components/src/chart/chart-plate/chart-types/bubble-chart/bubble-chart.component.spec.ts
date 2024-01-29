import { ComponentFixture } from '@angular/core/testing';

import { BubbleChartComponent } from './bubble-chart.component';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartPlateService } from '../../services/chart-plate.service';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ChartLimitEvent } from '../../../messages/events/chart-limit.event';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { BuildBubbleChartExecutor } from '../../../messages/executors/build-bubble-chart.executor';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';

describe('BubbleChartComponent', () => {
  let fixture: ComponentFixture<BubbleChartComponent>;
  const plateService = mock(ChartPlateService);
  const limitService = mock(ChartAxisLimitService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;
  let limitServiceChanged$: Subject<undefined>;

  beforeEach(async () => {
    limitServiceChanged$ = new Subject<undefined>();
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    when(postboy.subscribe(ChartLimitEvent.ID)).thenReturn(limitServiceChanged$);
    return MockBuilder(BubbleChartComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(ChartAxisLimitService, instance(limitService)));
  });

  beforeEach(() => {
    fixture = MockRender(BubbleChartComponent);
  });

  afterEach(() => {
    reset(plateService);
    reset(postboy);
    reset(limitService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add line on chartInitialized', () => {
    const dataset = Forger.create<number>()! as any; // a trick
    when(postboy.execute<BuildBubbleChartExecutor, any>(anything())).thenReturn(dataset);
    //
    chartInitialized.next(new ChartInitializedEvent({} as any));
    //
    const [ds] = capture(plateService.addDataset).last();
    should().true(ds === dataset);
  });
});
