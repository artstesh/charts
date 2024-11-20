import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { LegendOptions } from 'chart.js';
import { ChartLegendFactory } from './chart-legend.factory';
import { ChartLegendSettings } from './chart-legend.settings';
import { instance, mock, reset } from 'ts-mockito';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';

describe('#chart-elements XLinearAxisScaleFactory', () => {
  let settings: ChartLegendSettings;
  let legend: LegendOptions<any>;
  const postboy = mock(InnerPostboyService);

  beforeEach(() => {
    settings = new ChartLegendSettings();
    settings.align = Forger.create<'start' | 'center' | 'end'>()!;
    settings.position = Forger.create<'top' | 'right' | 'bottom' | 'left'>()!;
    legend = ChartLegendFactory.build(settings, instance(postboy));
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should have defined legend', () => {
    should().true(legend);
  });

  it('position is correct', () => {
    should()
      .string(legend.position as string)
      .equals(settings.position as string);
  });

  it('align correct', () => {
    should().string(legend.align).equals(settings.align);
  });
});
