import { ChartBrushService } from './chart-brush.service';
import { Forger } from '@artstesh/forger';
import { BrushRangeModel } from '../models/brush-range.model';
import { anyOfClass, instance, mock, reset, when } from 'ts-mockito';
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';
import { ZoomAreaCommand } from '../messages/commands/zoom-area.command';
import { MoveBrushCommand } from '../messages/commands/move-brush.command';
import { BrushAreaEvent } from '../messages/events/brush-area.event';
import { WidthRestrictionsCommand } from '../messages/commands/width-restrictions.command';
import { should } from '@artstesh/it-should';

describe('ChartBrushService', () => {
  let service: ChartBrushService;
  const postboy = mock(ChartPostboyService);
  const maxWidth = 100;
  const minWidth = 10;
  let area: BrushRangeModel = { left: 0, width: 0 };
  let moveBorder$: Subject<MoveBrushBorderCommand>;
  let areaEvent$: Subject<BrushAreaEvent>;
  let zoomCommand$: Subject<ZoomAreaCommand>;
  let moveCommand$: Subject<MoveBrushCommand>;
  let widthRestrict$: Subject<WidthRestrictionsCommand>;

  beforeEach(() => {
    moveBorder$ = new Subject<MoveBrushBorderCommand>();
    areaEvent$ = new Subject<BrushAreaEvent>();
    zoomCommand$ = new Subject<ZoomAreaCommand>();
    moveCommand$ = new Subject<MoveBrushCommand>();
    widthRestrict$ = new Subject<WidthRestrictionsCommand>();
    when(postboy.subscribe(WidthRestrictionsCommand.ID)).thenReturn(widthRestrict$);
    when(postboy.subscribe(ZoomAreaCommand.ID)).thenReturn(zoomCommand$);
    when(postboy.subscribe(MoveBrushCommand.ID)).thenReturn(moveCommand$);
    when(postboy.subscribe(MoveBrushBorderCommand.ID)).thenReturn(moveBorder$);
    when(postboy.subscribe(BrushAreaEvent.ID)).thenReturn(areaEvent$);
    service = new ChartBrushService(instance(postboy));
    service.up();
  });

  beforeEach(() => {
    when(postboy.fire(anyOfClass(BrushAreaEvent))).thenCall((ev) => {
      areaEvent$.next(ev);
      area = (ev as BrushAreaEvent).range;
    });
    widthRestrict$.next(new WidthRestrictionsCommand(maxWidth, minWidth));
    areaEvent$.subscribe((a) => (area = a.range));
    zoomCommand$.next(new ZoomAreaCommand(-50)); //set to half width
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('full width', () => {
    beforeEach(() => {
      widthRestrict$.next(new WidthRestrictionsCommand(maxWidth, minWidth)); // reset to full width
    });

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
      widthRestrict$.next(new WidthRestrictionsCommand(maxWidth, minWidth)); // reset to full width
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
      widthRestrict$.next(new WidthRestrictionsCommand(maxWidth, minWidth)); // reset to full width
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
      widthRestrict$.next(new WidthRestrictionsCommand(maxWidth, minWidth)); // reset to full width
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
