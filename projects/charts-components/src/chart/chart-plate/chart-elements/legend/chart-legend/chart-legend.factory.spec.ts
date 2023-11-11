import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { LegendOptions } from 'chart.js';
import { ChartLegendFactory } from './chart-legend.factory';
import { ChartLegendSettings } from "./chart-legend.settings";

describe('#chart-elements XLinearAxisScaleFactory', () => {
  let settings: ChartLegendSettings;
  let legend: LegendOptions<any>;

  beforeEach(() => {
    settings = new ChartLegendSettings();
    settings.align = Forger.create<'start' | 'center' | 'end'>()!;
    settings.position = Forger.create<'top' | 'right' | 'bottom' | 'left'>()!;
    legend = ChartLegendFactory.build(settings);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined legend', () => {
    should().true(legend);
  });

  it('position is correct', () => {
    should().string(legend.position as string).equals(settings.position as string);
  });

  it('align correct', () => {
    should().string(legend.align).equals(settings.align);
  });
});
