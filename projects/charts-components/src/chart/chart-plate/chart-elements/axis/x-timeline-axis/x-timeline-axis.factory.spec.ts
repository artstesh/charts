import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { ScaleOptionsByType } from 'chart.js';
import { XTimelineAxisFactory } from './x-timeline-axis.factory';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';

describe('#chart-elements XLinearAxisScaleFactory', () => {
  let settings: XTimelineAxisSettings;
  let scale: ScaleOptionsByType<'time'>;

  beforeEach(() => {
    settings = XTimelineAxisSettings.copy(Forger.create<XTimelineAxisSettings>()!);
    settings.dateUnit = Forger.create<'minute' | 'hour' | 'day' | 'week'>()!;
    scale = XTimelineAxisFactory.build(settings);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined scale', () => {
    should().true(scale);
  });

  it('displayGrid id defined', () => {
    should().true(scale.grid.display === settings.displayGrid);
  });

  it('limits are defined', () => {
    should()
      .number(scale.min as number)
      .equals(settings.limits[0]!);
    should()
      .number(scale.max as number)
      .equals(settings.limits[1]!);
  });

  it('sets ticks callback', () => {
    settings.dateFormat = (v: number, i: number) => `${v}-${i}`;
    const value = Forger.create<number>()!;
    const index = Forger.create<number>()!;
    //
    should()
      .string((scale.ticks as any).callback(value, index))
      .equals(settings.dateFormat(value, index));
  });

  it('sets unit', () => {
    //
    should()
      .string(scale.time.unit as string)
      .equals(settings.dateUnit);
  });
});
