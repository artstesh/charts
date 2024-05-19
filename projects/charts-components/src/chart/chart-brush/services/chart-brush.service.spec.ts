import { ChartBrushService } from './chart-brush.service';
import { Forger } from '@artstesh/forger';
import { BrushRangeModel } from '../models/brush-range.model';
import { anyOfClass, instance, mock, reset, when } from 'ts-mockito';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { should } from '@artstesh/it-should';
import { ChartDataEvent } from '../../messages/events/chart-data.event';
import { ChartInitializedEvent } from '../../messages/events/chart-initialized.event';

describe('ChartBrushService', () => {
  let service: ChartBrushService;
  const postboy = mock(ChartPostboyService);
  const maxWidth = 1000;
  let area: BrushRangeModel;
  let moveBorder$: Subject<MoveBrushBorderCommand>;
  let areaEvent$: Subject<BrushAreaEvent>;
  let zoomCommand$: Subject<ZoomAreaCommand>;
  let moveCommand$: Subject<MoveBrushCommand>;
  let dataChanged$: Subject<ChartDataEvent>;
  let chartEvent$: Subject<ChartInitializedEvent>;

  beforeEach(() => {
    chartEvent$ = new ReplaySubject<ChartInitializedEvent>(1);
    moveBorder$ = new Subject<MoveBrushBorderCommand>();
    areaEvent$ = new Subject<BrushAreaEvent>();
    zoomCommand$ = new Subject<ZoomAreaCommand>();
    moveCommand$ = new Subject<MoveBrushCommand>();
    dataChanged$ = new Subject<ChartDataEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartEvent$);
    when(postboy.subscribe(ZoomAreaCommand.ID)).thenReturn(zoomCommand$);
    when(postboy.subscribe(MoveBrushCommand.ID)).thenReturn(moveCommand$);
    when(postboy.subscribe(MoveBrushBorderCommand.ID)).thenReturn(moveBorder$);
    when(postboy.subscribe(BrushAreaEvent.ID)).thenReturn(areaEvent$);
    when(postboy.subscribe(ChartDataEvent.ID)).thenReturn(dataChanged$);
    service = new ChartBrushService(instance(postboy));
    service.up();
  });

  beforeEach(() => {
    area = { left: 0, width: maxWidth };
    when(postboy.fire(anyOfClass(BrushAreaEvent))).thenCall((ev) => {
      areaEvent$.next(ev);
      area = (ev as BrushAreaEvent).range;
    });
    chartEvent$.next(new ChartInitializedEvent({ canvas: { width: maxWidth } } as any));
    areaEvent$.next(new BrushAreaEvent(area));
    areaEvent$.subscribe((a) => (area = a.range));
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('full width', () => {
    beforeEach(() => {});

    it('zoomArea() ignore positive', () => {
      const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left;
      const expectedWidth = area.width;
      //
      zoomCommand$.next(new ZoomAreaCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('zoomArea() negative success', () => {
      const shift = -Forger.create<number>({ numberMin: 10, numberMax: 15 })!;
      const expectedLeft = area.left - shift / 2;
      const expectedWidth = area.width + shift;
      //
      zoomCommand$.next(new ZoomAreaCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('moveArea() ignore right', () => {
      const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('moveArea() ignore left', () => {
      const shift = -Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    describe('moveBorder()', () => {
      it('ignore right border to right', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('ignore left border to left', () => {
        const shift = -Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('left border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left + shift;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });
    });
  });

  describe('half width on the right side', () => {
    beforeEach(() => {
      zoomCommand$.next(new ZoomAreaCommand(-50)); //set to half width
      moveCommand$.next(new MoveBrushCommand(25)); // move to right
    });

    it('zoomArea() positive stop on right border', () => {
      const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
      const expectedLeft = area.left - shift / 2;
      const expectedWidth = maxWidth - expectedLeft;
      //
      zoomCommand$.next(new ZoomAreaCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    describe('moveBorder()', () => {
      it('ignore right border to right', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('left border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left - shift;
        const expectedWidth = area.width + shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('left border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left + shift;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });
    });

    it('moveArea() ignore right', () => {
      const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('moveArea() left success', () => {
      const shift = Forger.create<number>({ numberMin: 10, numberMax: 40 })!;
      const expectedLeft = area.left - shift;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(-shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });
  });

  describe('half width on the left side', () => {
    beforeEach(() => {
      zoomCommand$.next(new ZoomAreaCommand(-50)); // set to half width
      moveCommand$.next(new MoveBrushCommand(-25)); // move to left
    });

    it('zoomArea() positive stop on left border', () => {
      const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
      const expectedLeft = 0;
      const expectedWidth = area.width + shift;
      //
      zoomCommand$.next(new ZoomAreaCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    describe('moveBorder()', () => {
      it('ignore left border to left', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = 0;
        const expectedWidth = area.width;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('left border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left + shift;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = 0;
        const expectedWidth = area.width + shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });
    });

    it('moveArea() ignore left', () => {
      const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(-shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('moveArea() right success', () => {
      const shift = Forger.create<number>({ numberMin: 10, numberMax: 40 })!;
      const expectedLeft = area.left + shift;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });
  });

  describe('half width in the middle', () => {
    beforeEach(() => {
      zoomCommand$.next(new ZoomAreaCommand(-50)); // set to half width
    });

    it('zoomArea() positive success', () => {
      const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
      const expectedLeft = area.left - shift / 2;
      const expectedWidth = area.width + shift;
      //
      zoomCommand$.next(new ZoomAreaCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('zoomArea() negative success', () => {
      const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
      const expectedLeft = area.left + shift / 2;
      const expectedWidth = area.width - shift;
      //
      zoomCommand$.next(new ZoomAreaCommand(-shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    describe('moveBorder()', () => {
      it('left border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left - shift;
        const expectedWidth = area.width + shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('left border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
        const expectedLeft = area.left + shift;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to right success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width + shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
        //
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });

      it('right border to left success', () => {
        const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
        const expectedLeft = area.left;
        const expectedWidth = area.width - shift;
        //
        moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
        should().number(area.left).equals(expectedLeft);
        should().number(area.width).equals(expectedWidth);
      });
    });

    it('moveArea() left success', () => {
      const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
      const expectedLeft = area.left - shift;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(-shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });

    it('moveArea() right success', () => {
      const shift = Forger.create<number>({ numberMin: 10, numberMax: 20 })!;
      const expectedLeft = area.left + shift;
      const expectedWidth = area.width;
      //
      moveCommand$.next(new MoveBrushCommand(shift));
      //
      should().number(area.left).equals(expectedLeft);
      should().number(area.width).equals(expectedWidth);
    });
  });
});
