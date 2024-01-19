import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { AreaChartSettings } from './area-chart.settings';
import { Direction } from '../../../models';

describe('#chart-elements AreaChartSettings', () => {
  let model: AreaChartSettings;

  beforeEach(() => {
    model = new AreaChartSettings().copy(Forger.create<AreaChartSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('ids are different', () => {
    const settings1 = new AreaChartSettings();
    const settings2 = new AreaChartSettings();
    //
    should().string(settings1.id).not.equals(settings2.id);
  });

  it('names are different', () => {
    const settings1 = new AreaChartSettings();
    const settings2 = new AreaChartSettings();
    //
    should().string(settings1.name).not.equals(settings2.name);
  });

  it('setTension()', () => {
    const radius = Forger.create<number>()!;
    //
    model = model.setTension(radius);
    //
    should().number(model.tension).equals(radius);
  });

  it('setDirection()', () => {
    const value = Forger.create<Direction>()!;
    //
    model = model.setDirection(value);
    //
    should().number(model.direction).equals(value);
  });

  it('setColors()', () => {
    const value = Forger.create<string[]>()!;
    //
    model = model.setColors(value);
    //
    should().array(model.colors).equal(value);
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
      const other = new AreaChartSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different id', () => {
      const other = new AreaChartSettings().copy(model);
      other.id = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different order', () => {
      const other = new AreaChartSettings().copy(model);
      other.order = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = new AreaChartSettings().copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different order', () => {
      const other = new AreaChartSettings().copy(model);
      model.direction = Direction.LeftRight;
      other.direction = Direction.BottomTop;
      //
      should().false(model.isSame(other));
    });

    it('different colors', () => {
      const other = new AreaChartSettings().copy(model);
      other.colors = Forger.create<string[]>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new AreaChartSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
