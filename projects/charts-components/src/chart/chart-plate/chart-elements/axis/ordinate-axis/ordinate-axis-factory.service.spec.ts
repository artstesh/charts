import { OrdinateAxisFactory } from './ordinate-axis-factory.service';
import { ScaleOptionsByType } from 'chart.js';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { OrdinateAxisSettings } from './ordinate-axis.settings';
import { ChartConstants } from '../../../../models/chart-constants';

describe('OrdinateAxisFactory', () => {
  let settings: OrdinateAxisSettings;
  let scale: ScaleOptionsByType<'linear'>;

  beforeEach(() => {
    settings = OrdinateAxisSettings.copy(Forger.create<OrdinateAxisSettings>()!);
    scale = new OrdinateAxisFactory().build(settings);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined scale', () => {
    should().true(scale);
  });

  it('setDisplayGrid() success', () => {
    should().true(scale.grid.display === settings.displayGrid);
  });

  [
    { right: true, expected: ChartConstants.LeftAxisId },
    { right: false, expected: ChartConstants.LeftAxisId },
  ].forEach((e) =>
    it(`axis is always y, right -  ${e.right}`, () => {
      settings.right = e.right;
      const scale = new OrdinateAxisFactory().build(settings);
      //
      should().true(scale.axis === e.expected);
    }),
  );

  [
    { right: true, expected: 'right' },
    { right: false, expected: 'left' },
  ].forEach((e) =>
    it(`position success, right -  ${e.right}`, () => {
      settings.right = e.right;
      const scale = new OrdinateAxisFactory().build(settings);
      //
      should().true(scale.position === e.expected);
    }),
  );
});
