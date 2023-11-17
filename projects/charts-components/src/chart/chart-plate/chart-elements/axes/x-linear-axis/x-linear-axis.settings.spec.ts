import { XLinearAxisSettings } from './x-linear-axis.settings';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';

describe('#chart-elements XLinearAxisSettings', () => {
  let model: XLinearAxisSettings;

  beforeEach(() => {
    model = new XLinearAxisSettings();
    model.limits = Forger.create<[number, number | null]>()!;
    model.displayGrid = Forger.create<boolean>()!;
  });

  afterEach(() => {
    expect().nothing();
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

  describe('copy()', () => {
    it('success', () => {
      const other = XLinearAxisSettings.copy(model);
      //
      should().objects(model, other).equal();
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

  describe('isSame()', () => {
    it('are same', () => {
      const other = new XLinearAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = model.displayGrid;
      //
      should().true(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XLinearAxisSettings();
      other.limits = [...model.limits];
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different limits', () => {
      const other = new XLinearAxisSettings();
      other.limits = Forger.create<[number | null, number | null]>()!;
      other.displayGrid = model.displayGrid;
      //
      should().false(model.isSame(other));
    });
  });
});
