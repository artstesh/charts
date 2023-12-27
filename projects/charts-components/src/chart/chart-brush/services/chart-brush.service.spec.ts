import { ChartBrushService } from './chart-brush.service';
import { Forger } from '@artstesh/forger';
import { BrushRangeModel } from '../models/brush-range.model';
import { instance, mock, when } from "ts-mockito";
import { ChartPostboyService } from '../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { MoveBrushBorderCommand } from '../../messages/commands/move-brush-border.command';

describe('ChartBrushService', () => {
   let service: ChartBrushService;
   const postboy = mock(ChartPostboyService);
   const maxWidth = 100;
   const minWidth = 10;
   let area: BrushRangeModel = { left: 0, width: 0 };
   let moveBorder$: Subject<MoveBrushBorderCommand>;

   beforeEach(() => {
      moveBorder$ = new Subject<MoveBrushBorderCommand>();
      when(postboy.subscribe(MoveBrushBorderCommand.ID)).thenReturn(moveBorder$);
      service = new ChartBrushService(instance(postboy));
      service.up();
   });

   beforeEach(() => {
      service.setWidthRestrictions(maxWidth, minWidth);
      service.SelectedArea$.subscribe(a => (area = a));
      service.zoomArea(-50); //set to half width
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });

   describe('full width', () => {
      beforeEach(() => {
         service.setWidthRestrictions(maxWidth, minWidth); // reset to full width
      });

      it('zoomArea() ignore positive', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.zoomArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('zoomArea() negative success', () => {
         const shift = -Forger.create<number>({ numberMin: 10, numberMax: 15 })!;
         const expectedLeft = area.left - shift / 2;
         const expectedWidth = area.width + shift;
         //
         service.zoomArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveArea() ignore right', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveArea() ignore left', () => {
         const shift = -Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      describe('moveBorder()', () => {
        it('ignore right border to right', () => {
          const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
          const expectedLeft = area.left;
          const expectedWidth = area.width;
          //
          moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
          //
          expect(area.left).toEqual(expectedLeft);
          expect(area.width).toEqual(expectedWidth);
        });

        it('ignore left border to left', () => {
          const shift = -Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
          const expectedLeft = area.left;
          const expectedWidth = area.width;
          //
          moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
          //
          expect(area.left).toEqual(expectedLeft);
          expect(area.width).toEqual(expectedWidth);
        });

        it('left border to right success', () => {
          const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
          const expectedLeft = area.left + shift;
          const expectedWidth = area.width - shift;
          //
          moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
          //
          expect(area.left).toEqual(expectedLeft);
          expect(area.width).toEqual(expectedWidth);
        });

        it('right border to left success', () => {
          const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
          const expectedLeft = area.left;
          const expectedWidth = area.width - shift;
          //
          moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
          //
          expect(area.left).toEqual(expectedLeft);
          expect(area.width).toEqual(expectedWidth);
        });
      });
   });

   describe('half width on the right side', () => {
      beforeEach(() => {
         service.setWidthRestrictions(maxWidth, minWidth); // reset to full width
         service.zoomArea(-50); //set to half width
         service.moveArea(25); // move to right
      });

      it('zoomArea() positive stop on right border', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
         const expectedLeft = area.left - shift / 2;
         const expectedWidth = maxWidth - expectedLeft;
         //
         service.zoomArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

     describe('moveBorder()', () => {
       it('ignore right border to right', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('left border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width + shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });
     });

      it('moveArea() ignore right', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveArea() left success', () => {
         const shift = Forger.create<number>({ numberMin: 10, numberMax: 40 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width;
         //
         service.moveArea(-shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });
   });

   describe('half width on the left side', () => {
      beforeEach(() => {
         service.setWidthRestrictions(maxWidth, minWidth); // reset to full width
         service.zoomArea(-50); // set to half width
         service.moveArea(-25); // move to left
      });

      it('zoomArea() positive stop on left border', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
         const expectedLeft = 0;
         const expectedWidth = area.width + shift;
         //
         service.zoomArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

     describe('moveBorder()', () => {
       it('ignore left border to left', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = 0;
         const expectedWidth = area.width;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('right border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = 0;
         const expectedWidth = area.width + shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });
     });


      it('moveArea() ignore left', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveArea(-shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveArea() right success', () => {
         const shift = Forger.create<number>({ numberMin: 10, numberMax: 40 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width;
         //
         service.moveArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });
   });

   describe('half width in the middle', () => {
      beforeEach(() => {
         service.setWidthRestrictions(maxWidth, minWidth); // reset to full width
         service.zoomArea(-50); // set to half width
      });

      it('zoomArea() positive success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
         const expectedLeft = area.left - shift / 2;
         const expectedWidth = area.width + shift;
         //
         service.zoomArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('zoomArea() negative success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 15 })!;
         const expectedLeft = area.left + shift / 2;
         const expectedWidth = area.width - shift;
         //
         service.zoomArea(-shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

     describe('moveBorder()', () => {
       it('left border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width + shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'left'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('right border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width + shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(shift, 'right'));
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });

       it('right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         moveBorder$.next(new MoveBrushBorderCommand(-shift, 'right'));-
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
       });
     });


      it('moveArea() left success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width;
         //
         service.moveArea(-shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveArea() right success', () => {
         const shift = Forger.create<number>({ numberMin: 10, numberMax: 20 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width;
         //
         service.moveArea(shift);
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });
   });
});
