import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { BubbleChartSettings } from './bubble-chart.settings';

describe('#chart-elements BubbleChartSettings', () => {
  let model: BubbleChartSettings;

  beforeEach(() => {
    model = new BubbleChartSettings().copy(Forger.create<BubbleChartSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('ids are different', () => {
    const settings1 = new BubbleChartSettings();
    const settings2 = new BubbleChartSettings();
    //
    should().string(settings1.id).not.equals(settings2.id);
  });

  it('names are different', () => {
    const settings1 = new BubbleChartSettings();
    const settings2 = new BubbleChartSettings();
    //
    should().string(settings1.name).not.equals(settings2.name);
  });

  it('setBorderColor()', () => {
    const color = Forger.create<string>()!;
    //
    model = model.setBorderColor(color);
    //
    should().string(model.borderColor).equals(color);
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
      const other = new BubbleChartSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different id', () => {
      const other = new BubbleChartSettings().copy(model);
      other.id = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different order', () => {
      const other = new BubbleChartSettings().copy(model);
      other.order = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = new BubbleChartSettings().copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different color', () => {
      const other = new BubbleChartSettings().copy(model);
      other.color = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different borderColor', () => {
      const other = new BubbleChartSettings().copy(model);
      other.borderColor = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new BubbleChartSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
