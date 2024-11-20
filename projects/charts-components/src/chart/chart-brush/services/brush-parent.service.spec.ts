import { BrushParentService } from './brush-parent.service';
import { instance, mock, reset, when } from 'ts-mockito';
import { InnerPostboyService } from '../../services/inner-postboy.service';
import { Subject } from 'rxjs';
import { ResetBrushCommand } from '../messages/commands/reset-brush.command';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';
import { ChartDataEvent } from '../../messages/events/chart-data.event';
import { BrushAreaEvent } from '../messages/events/brush-area.event';

describe('BrushParentService', () => {
  let service: BrushParentService;
  const postboy = mock(InnerPostboyService);
  let resetBrush$: Subject<ResetBrushCommand>;
  let chartInit$: Subject<ChartInitializedEvent>;
  let dataEvent$: Subject<ChartDataEvent>;
  let areaEvent$: Subject<BrushAreaEvent>;

  beforeEach(() => {
    resetBrush$ = new Subject<ResetBrushCommand>();
    chartInit$ = new Subject<ChartInitializedEvent>();
    dataEvent$ = new Subject<ChartDataEvent>();
    areaEvent$ = new Subject<BrushAreaEvent>();
    when(postboy.subscribe(ResetBrushCommand.ID)).thenReturn(resetBrush$);
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInit$);
    when(postboy.subscribe(ChartDataEvent.ID)).thenReturn(dataEvent$);
    when(postboy.subscribe(BrushAreaEvent.ID)).thenReturn(areaEvent$);
    service = new BrushParentService(instance(postboy));
    service.up();
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
