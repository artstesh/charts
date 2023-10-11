import { PointStyle, ScriptableContext } from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';

export class ChartScatterConfigModel {
   pointRadius: number | ((ctx: ScriptableContext<'line'>, options: AnyObject) => number) = 0;
   yAxisId = 'y';
   color?: string;
   pointStyle: PointStyle = 'triangle';
   pointBorderWidth?: number;
   borderColor?: string;
   pointHoverRadius?: number;
   pointHoverBackgroundColor?: string;
   pointHoverBorderWidth?: number;
   pointHitRadius?: number;
   hidden = false;

   constructor(config?: Partial<ChartScatterConfigModel>) {
      if (config) {
         Object.assign(this, config);
      }
   }
}
