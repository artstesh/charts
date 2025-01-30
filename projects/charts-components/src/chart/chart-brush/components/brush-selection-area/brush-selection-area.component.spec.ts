import { ComponentFixture } from '@angular/core/testing';
import { instance, mock, reset, when } from 'ts-mockito';
import { ReplaySubject, Subject } from 'rxjs';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { should } from '@artstesh/it-should';
import { BrushSelectionAreaComponent } from './brush-selection-area.component';
import { ChartBrushService } from '../../services/chart-brush.service';
import { ChartModule } from '../../../chart.module';
import { BrushAreaEvent } from '../../messages/events/brush-area.event';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ChartScrollEvent } from '../../../messages/events/chart-scroll.event';

describe('ChartBrushSelectionAreaComponent', () => {
  let fixture: ComponentFixture<BrushSelectionAreaComponent>;
  const postboy = mock(InnerPostboyService);
  const brushService = mock(ChartBrushService);
  let SelectedArea$: ReplaySubject<BrushAreaEvent>;
  let chartEvent$: Subject<ChartInitializedEvent>;
  let scrollEvent$: Subject<ChartScrollEvent>;

  beforeEach(async () => {
    return MockBuilder(BrushSelectionAreaComponent, ChartModule).provide(
      MockProvider(InnerPostboyService, instance(postboy)),
    );
  });

  beforeEach(() => {
    chartEvent$ = new ReplaySubject<ChartInitializedEvent>(1);
    scrollEvent$ = new ReplaySubject<ChartScrollEvent>(1);
    SelectedArea$ = new ReplaySubject<BrushAreaEvent>(1);
    when(postboy.sub(ChartInitializedEvent)).thenReturn(chartEvent$);
    when(postboy.sub(BrushAreaEvent)).thenReturn(SelectedArea$);
    when(postboy.sub(ChartScrollEvent)).thenReturn(scrollEvent$);
    fixture = MockRender(BrushSelectionAreaComponent);
  });

  afterEach(() => {
    reset(brushService);
    reset(postboy);
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
