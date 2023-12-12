import { ScaleOptionsByType } from 'chart.js';

export class XCategoryAxisFactory {
  public static build(labels: string[]): ScaleOptionsByType<'category'> {
    return {
      type: 'category',
      display: 'auto',
      grid: { display: false },
      labels: labels,
      offset: true,
    } as ScaleOptionsByType<'category'>;
  }
}
