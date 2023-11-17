import { should } from '@artstesh/it-should';
import { Forger } from '@artstesh/forger';
import { ScaleOptionsByType } from 'chart.js';
import { XTimelineAxisFactory } from "./x-timeline-axis.factory";
import { XTimelineAxisSettings } from "./x-timeline-axis.settings";

describe('#chart-elements XLinearAxisScaleFactory', () => {
  let settings: XTimelineAxisSettings;
  let scale: ScaleOptionsByType<'time'>;

  beforeEach(() => {
    settings = XTimelineAxisSettings.copy(Forger.create<XTimelineAxisSettings>()!);
    settings.locale = Forger.create<'en'|'ru'|'pl'>()!;
    settings.dateFormat.timeZone = undefined;// too hard to mock properly, doesn't matter
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
    should().number(scale.min as number).equals(settings.limits[0]!);
    should().number(scale.max as number).equals(settings.limits[1]!);
  });

  it('sets ticks callback', () => {
    const date = Forger.create<Date>()!;
    const expected = date.toLocaleDateString(settings.locale, settings.dateFormat);
    //
    const result = (scale.ticks as any).callback!(date) as string;
    //
    should().string(result).equals(expected);
  });
});
