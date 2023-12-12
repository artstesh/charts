import { ChartConfiguration } from 'chart.js';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartPlateFactory } from './chart-plate.factory';
import { ChartPlateSettings } from './chart-plate.settings';

describe('ChartPlateFactory', () => {
  let settings: ChartPlateSettings;
  let configuration: ChartConfiguration;

  beforeEach(() => {
    settings = new ChartPlateSettings().copy(Forger.create<ChartPlateSettings>()!);
    configuration = ChartPlateFactory.build(settings);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined configuration', () => {
    should().true(configuration);
  });

  it('interactionMode is correct', () => {
    should().string(configuration!.options!.interaction!.mode).equals(settings.interactionMode);
  });

  it('type is correct', () => {
    should().string(configuration!.type).equals(settings.type);
  });
});
