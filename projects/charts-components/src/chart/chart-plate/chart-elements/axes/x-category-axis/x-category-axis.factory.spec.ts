import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { ScaleOptionsByType } from 'chart.js';
import { XCategoryAxisFactory } from './x-category-axis.factory';

describe('#chart-elements XCategoryAxisFactory', () => {
  let labels: string[];
  let scale: ScaleOptionsByType<'category'>;

  beforeEach(() => {
    labels = Forger.create<string[]>()!;
    scale = XCategoryAxisFactory.build(labels);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined scale', () => {
    should().true(scale);
  });

  it('grid is not visible', () => {
    should()
      .array((scale as any).labels)
      .equal(labels);
  });
});
