import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { XTimelineAxisSettings } from './x-timeline-axis.settings';
import { TickDateDisplayFormat } from '../../../../models';

describe('#chart-elements XTimelineAxisSettings', () => {
  let model: XTimelineAxisSettings;

  beforeEach(() => {
    model = XTimelineAxisSettings.copy(Forger.create<XTimelineAxisSettings>()!);
    model.dateUnit = Forger.create<'minute' | 'hour' | 'day' | 'week'>()!;
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('setLocale()', () => {
    it('success', () => {
      const expected = Forger.create<'month' | 'quarter' | 'year'>()!;
      //
      model = model.setDateUnit(expected);
      //
      should().true(model.dateUnit === expected);
    });
  });

  describe('setDateFormat()', () => {
    it('success', () => {
      const expected = (v: number, i: number) => `${v}-${i}`;
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
      const other = XTimelineAxisSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = XTimelineAxisSettings.copy(model);
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = XTimelineAxisSettings.copy(model);
      other.limits = Forger.create<[number, number]>()!;
      //
      should().false(model.isSame(other));
    });

    it('different dateUnit', () => {
      const other = XTimelineAxisSettings.copy(model);
      other.dateUnit = Forger.create<'month' | 'quarter' | 'year'>()!;
      //
      should().false(model.isSame(other));
    });

    it('different dateFormat', () => {
      const other = XTimelineAxisSettings.copy(model);
      other.dateFormat = (v, i) => `${v}-${i}`;
      //
      should().false(model.isSame(other));
    });
  });
});
