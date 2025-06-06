import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ScatterChartSettings } from './scatter-chart.settings';

describe('#chart-elements ScatterChartSettings', () => {
  let model: ScatterChartSettings;

  beforeEach(() => {
    model = new ScatterChartSettings();
    model.pointRotation = Forger.create<number>()!;
  });

  afterEach(() => {
    expect().nothing();
  });

  it('ids are different', () => {
    const settings1 = new ScatterChartSettings();
    const settings2 = new ScatterChartSettings();
    //
    should().string(settings1.id).not.equals(settings2.id);
  });

  it('names are different', () => {
    const settings1 = new ScatterChartSettings();
    const settings2 = new ScatterChartSettings();
    //
    should().string(settings1.name).not.equals(settings2.name);
  });

  it('setPointStyle()', () => {
    const style = Forger.create<'cross' | 'crossRot' | 'dash'>()!;
    //
    model = model.setPointStyle(style);
    //
    should()
      .string(model.pointStyle + '')
      .equals(style + '');
  });

  it('setPointRadius()', () => {
    const expected = Forger.create<number>()!;
    //
    model = model.setPointRadius(expected);
    //
    should().number(model.pointRadius).equals(expected);
  });

  it('setRight()', () => {
    const expected = Forger.create<boolean>()!;
    //
    model = model.setRight(expected);
    //
    should().true(model.yLeft !== expected);
  });

  it('setOrder()', () => {
    const expected = Forger.create<number>()!;
    //
    model = model.setOrder(expected);
    //
    should().number(model.order).equals(expected);
  });

  it('setPointRotation()', () => {
    const expected = Forger.create<number>()!;
    //
    model = model.setPointRotation(expected);
    //
    should().number(model.pointRotation).equals(expected);
  });

  it('setColor()', () => {
    const expected = Forger.create<string>()!;
    //
    model = model.setColor(expected);
    //
    should().string(model.color).equals(expected);
  });

  it('setName()', () => {
    const expected = Forger.create<string>()!;
    //
    model = model.setName(expected);
    //
    should().string(model.name).equals(expected);
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new ScatterChartSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different id', () => {
      const other = new ScatterChartSettings().copy(model);
      other.id = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different order', () => {
      const other = new ScatterChartSettings().copy(model);
      other.order = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different pointRadius', () => {
      const other = new ScatterChartSettings().copy(model);
      other.pointRadius = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different pointRotation', () => {
      const other = new ScatterChartSettings().copy(model);
      other.pointRotation = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = new ScatterChartSettings().copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different color', () => {
      const other = new ScatterChartSettings().copy(model);
      other.color = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different pointStyle', () => {
      const other = new ScatterChartSettings().copy(model);
      other.pointStyle = Forger.create<'cross' | 'crossRot' | 'dash'>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new ScatterChartSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
