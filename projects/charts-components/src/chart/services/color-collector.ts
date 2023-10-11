import shuffle from 'lodash/shuffle';
const colors = [
   '#84649c',
   '#f4362d',
   '#006ab4',
   '#ffe179',
   '#9bce00',
   '#76d3d0',
   '#ce595a',
   '#a98700',
   '#4f2a6a',
   '#fef100',
   '#a9a000',
   '#05b6ac',
   '#a4511c',
   '#3d46a3',
   '#f87b2d',
   '#76d1a7',
   '#07b163',
   '#a31e1b',
   '#82649b',
   '#262a6b',
   '#62669c',
   '#668700',
   '#78a9d3',
   '#b396c9',
   '#76d1a7',
   '#d79d40',
   '#cf845a',
   '#027670',
   '#ffca7a',
   '#004376',
   '#fab48c',
   '#7943a1',
   '#d6b641',
   '#ab6c00',
   '#78a9d3',
   '#3ea8a2',
   '#ffa500',
   '#d6cc41',
   '#f98c8d',
   '#99b642',
   '#fff679',
   '#9496ca',
   '#6c276a',
   '#02753f',
   '#a09a8c',
   '#c5e178',
   '#ffce00',
   '#a540a0'
];

export class ColorCollector {
   private static index = 0;

   public static getColor(): string {
      if (++this.index >= colors.length) this.index = 0;
      return colors[this.index];
   }
}
