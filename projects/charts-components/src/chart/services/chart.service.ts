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

   fillGapsInData(data: ChartDataModel[]): ChartDataModel[] {
      const day = 24 * 60 * 60 * 1000;
      const min = minBy(data, (d: ChartDataModel) => d.x)?.x || 0;
      const max = maxBy(data, (d: ChartDataModel) => d.x)?.x || 1;
      for (let i = min; i < max; i += day) {
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
