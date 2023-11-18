import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';

describe('#chart-elements XTimelineAxisSettings', () => {
  let model: XTimelineAxisSettings;

  beforeEach(() => {
    model = XTimelineAxisSettings.copy(Forger.create<XTimelineAxisSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('setLocale()', () => {
    it('success', () => {
      const expected = Forger.create<string>()!;
      //
      model = model.setLocale(expected);
      //
      should().string(model.locale).equals(expected);
    });
  });

  describe('setDateFormat()', () => {
    it('success', () => {
      const expected = Forger.create<Intl.DateTimeFormatOptions>()!;
      //
      model = model.setDateFormat(expected);
      //
      should().true(model.dateFormat === expected);
    });
  });

  describe('setLimits()', () => {
    it('success', () => {
      const expected = Forger.create<[number, number]>()!;
      //
      model = model.setLimits(expected);
      //
      should().array(model.limits).equal(expected);
    });
  });

  describe('setDisplayGrid()', () => {
    it('success', () => {
      const expected = Forger.create<boolean>()!;
      //
      model = model.setDisplayGrid(expected);
      //
      should().true(model.displayGrid === expected);
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const other = XTimelineAxisSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new XTimelineAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = model.displayGrid;
      //
      should().true(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XTimelineAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XTimelineAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different limits', () => {
      const other = new XTimelineAxisSettings();
      other.limits = Forger.create<[number | null, number | null]>()!;
      other.displayGrid = model.displayGrid;
      //
      should().false(model.isSame(other));
    });
  });
});
