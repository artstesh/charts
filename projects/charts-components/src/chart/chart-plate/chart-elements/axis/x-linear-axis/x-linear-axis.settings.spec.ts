import { XLinearAxisSettings } from './x-linear-axis.settings';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';

describe('#chart-elements XLinearAxisSettings', () => {
  let model: XLinearAxisSettings;

  beforeEach(() => {
    model = XLinearAxisSettings.copy(Forger.create<XLinearAxisSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
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

  describe('setMaxRotation()', () => {
    it('success', () => {
      const expected = Forger.create<number>()!;
      //
      model = model.setMaxRotation(expected);
      //
      should().true(model.maxRotation === expected);
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const other = XLinearAxisSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = XLinearAxisSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XLinearAxisSettings();
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different maxRotation', () => {
      const other = XLinearAxisSettings.copy(model);
      other.maxRotation = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });
  });
});
