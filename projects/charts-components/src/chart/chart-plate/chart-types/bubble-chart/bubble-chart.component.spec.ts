import { ComponentFixture } from '@angular/core/testing';

import { BubbleChartComponent } from './bubble-chart.component';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartPlateService } from '../../services/chart-plate.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { BuildBubbleChartExecutor } from '../../../messages/executors/build-bubble-chart.executor';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';

describe('BubbleChartComponent', () => {
  let fixture: ComponentFixture<BubbleChartComponent>;
  const plateService = mock(ChartPlateService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(BubbleChartComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(BubbleChartComponent);
  });

  afterEach(() => {
    reset(plateService);
    reset(postboy);
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
