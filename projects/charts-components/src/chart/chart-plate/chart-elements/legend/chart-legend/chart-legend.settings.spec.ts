import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartLegendSettings } from './chart-legend.settings';

describe('#chart-elements ChartLegendSettings', () => {
  let model: ChartLegendSettings;

  beforeEach(() => {
    model = new ChartLegendSettings();
    model.align = Forger.create<'start' | 'center' | 'end'>()!;
    model.position = Forger.create<'top' | 'right' | 'bottom' | 'left'>()!;
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('copy()', () => {
    it('success', () => {
      const other = ChartLegendSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe('setAlign()', () => {
    it('success', () => {
      const expected = Forger.create<'start' | 'center' | 'end'>()!;
      //
      model = model.setAlign(expected);
      //
      should().string(model.align).equals(expected);
    });
  });

  describe('setPosition()', () => {
    it('success', () => {
      const expected = Forger.create<'bottom' | 'left' | 'top' | 'right'>()!;
      //
      model = model.setPosition(expected);
      //
      should()
        .string(model.position as string)
        .equals(expected);
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = ChartLegendSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different align', () => {
      const other = ChartLegendSettings.copy(model);
      model.align = Forger.create<'center' | 'end'>()!;
      other.align = 'start';
      //
      should().false(model.isSame(other));
    });

    it('different position', () => {
      const other = ChartLegendSettings.copy(model);
      model.position = Forger.create<'bottom' | 'left'>()!;
      other.position = Forger.create<'top' | 'right'>()!;
      //
      should().false(model.isSame(other));
    });
  });
});
