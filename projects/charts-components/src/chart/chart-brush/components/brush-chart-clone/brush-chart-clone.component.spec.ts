import { ComponentFixture } from '@angular/core/testing';

import { BrushChartCloneComponent } from './brush-chart-clone.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { instance, mock, reset, when } from 'ts-mockito';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { should } from '@artstesh/it-should';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ReplaySubject } from 'rxjs';
import { ChartDataEvent } from '../../../messages/events/chart-data.event';

describe('BrushChartCloneComponent', () => {
  let fixture: ComponentFixture<BrushChartCloneComponent>;
  const postboy = mock(ChartPostboyService);
  let chartEvent$: ReplaySubject<ChartInitializedEvent>;
  let dataEvent$: ReplaySubject<ChartDataEvent>;

  beforeEach(async () => {
    chartEvent$ = new ReplaySubject<ChartInitializedEvent>(1);
    dataEvent$ = new ReplaySubject<ChartDataEvent>(1);
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartEvent$);
    when(postboy.subscribe(ChartDataEvent.ID)).thenReturn(dataEvent$);
    return MockBuilder(BrushChartCloneComponent, ChartModule).provide(
      MockProvider(ChartPostboyService, instance(postboy)),
    );
  });

  beforeEach(() => {
    fixture = MockRender(BrushChartCloneComponent);
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
