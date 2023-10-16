import { ElementRef, Injectable } from '@angular/core';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {ChartClickModel, ChartDataModel} from "../models";
import {ColorCollector} from "./color-collector";

@Injectable({
   providedIn: 'root'
})
export class ChartService {
   colorCache: { [id: string]: string } = {};
   private clickedElementsSubject$ = new Subject<ChartClickModel>();
   clickedElements$ = this.clickedElementsSubject$.asObservable().pipe(filter(e => !!e));

   constructor() {}

   getRandomColor(name = ''): string {
      if (!name) {
         return ColorCollector.getColor();
      }
      if (!this.colorCache[name]) {
         this.colorCache[name] = ColorCollector.getColor();
      }
      return this.colorCache[name];
   }

   getGradient(ref: ElementRef): CanvasGradient {
      const gradient: CanvasGradient = ref.nativeElement
         .getContext('2d')
         .createLinearGradient(0, 0, ref.nativeElement.width, 0);
      gradient.addColorStop(0, 'rgba(255, 222, 45, 0.4)');
      gradient.addColorStop(0.5, 'rgba(108, 186, 47, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 222, 45, 0.4)');
      return gradient;
   }

   fillGapsInData(data: ChartDataModel[]): ChartDataModel[] {
      const day = 24 * 60 * 60 * 1000;
      const minDate = minBy(data, (d: ChartDataModel) => d.x)?.x || new Date().getTime();
      const maxDate = maxBy(data, (d: ChartDataModel) => d.x)?.x || 0;
      for (let i = minDate; i < maxDate; i += day) {
         if (data.filter(r => r.x === i).length === 0) {
            data.push({ x: i, y: Number.NaN });
         }
      }
      return orderBy(data, (r: ChartDataModel) => r.x);
   }

   setClickedElement(model: ChartClickModel): void {
     this.clickedElementsSubject$.next(model);
   }
}
