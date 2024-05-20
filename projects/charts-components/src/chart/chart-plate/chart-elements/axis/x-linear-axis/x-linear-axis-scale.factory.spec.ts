import { XLinearAxisScaleFactory } from './x-linear-axis-scale.factory';
import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { XLinearAxisSettings } from './x-linear-axis.settings';
import { ScaleOptionsByType } from 'chart.js';

describe('#chart-elements XLinearAxisScaleFactory', () => {
  let settings: XLinearAxisSettings;
  let scale: ScaleOptionsByType<'linear'>;

  beforeEach(() => {
    settings = XLinearAxisSettings.copy(Forger.create<XLinearAxisSettings>()!);
    scale = XLinearAxisScaleFactory.build(settings);
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

  it('maxRotation success', () => {
    should().true(scale.ticks.maxRotation === settings.maxRotation);
  });
});
