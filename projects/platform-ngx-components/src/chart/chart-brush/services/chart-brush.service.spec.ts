import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChartBrushService } from './chart-brush.service';
import { Forger } from '@artstesh/forger';
import {SelectedAreaModel} from "../../models";

describe('ChartBrushService', () => {
   let service: ChartBrushService;
   const maxWidth = 100;
   const minWidth = 10;
   let area: SelectedAreaModel = { left: 0, width: 0 };

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ChartBrushService]
      });
      service = TestBed.inject(ChartBrushService);
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

      it('moveBorder() ignore right border to right', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveBorder(shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() ignore left border to left', () => {
         const shift = -Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveBorder(shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(-shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
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

      it('moveBorder() ignore right border to right', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width;
         //
         service.moveBorder(shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(-shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() left border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width + shift;
         //
         service.moveBorder(-shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(shift, 'left');
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

      it('moveBorder() ignore left border to left', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = 0;
         const expectedWidth = area.width;
         //
         service.moveBorder(-shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = 0;
         const expectedWidth = area.width + shift;
         //
         service.moveBorder(shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(-shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
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

      it('moveBorder() left border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left - shift;
         const expectedWidth = area.width + shift;
         //
         service.moveBorder(-shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() left border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 1, numberMax: 10 })!;
         const expectedLeft = area.left + shift;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(shift, 'left');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to right success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width + shift;
         //
         service.moveBorder(shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
      });

      it('moveBorder() right border to left success', () => {
         const shift = Forger.create<number>({ numberMin: 5, numberMax: 20 })!;
         const expectedLeft = area.left;
         const expectedWidth = area.width - shift;
         //
         service.moveBorder(-shift, 'right');
         //
         expect(area.left).toEqual(expectedLeft);
         expect(area.width).toEqual(expectedWidth);
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
