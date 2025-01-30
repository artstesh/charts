import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartLineSettings } from './chart-line.settings';

describe('#chart-elements ChartLineSettings', () => {
  let model: ChartLineSettings;

  beforeEach(() => {
    model = new ChartLineSettings().copy(Forger.create<ChartLineSettings>()!);
    model.fill = Forger.create<false | 'start' | 'end' | 'origin'>()!;
  });

  afterEach(() => {
    expect().nothing();
  });

  it('ids are different', () => {
    const settings1 = new ChartLineSettings();
    const settings2 = new ChartLineSettings();
    //
    should().string(settings1.id).not.equals(settings2.id);
  });

  it('names are different', () => {
    const settings1 = new ChartLineSettings();
    const settings2 = new ChartLineSettings();
    //
    should().string(settings1.name).not.equals(settings2.name);
  });

  it('fill is false by default', () => {
    //
    should().false(new ChartLineSettings().fill);
  });

  it('borderWidth is undefined by default', () => {
    //
    should().false(new ChartLineSettings().borderWidth);
  });

  it('setPointRadius()', () => {
    const radius = Forger.create<number>()!;
    //
    model = model.setPointRadius(radius);
    //
    should()
      .number(model.pointRadius as number)
      .equals(radius);
  });

  it('setBorderWidth()', () => {
    const width = Forger.create<number>()!;
    //
    model = model.setBorderWidth(width);
    //
    should()
      .number(model.borderWidth as number)
      .equals(width);
  });

  it('setTension()', () => {
    const radius = Forger.create<number>()!;
    //
    model = model.setTension(radius);
    //
    should().number(model.tension).equals(radius);
  });

  it('setFill()', () => {
    const fill = Forger.create<false | 'start' | 'end' | 'origin'>()!;
    //
    model = model.setFill(fill);
    //
    should().true(model.fill === fill);
  });

  it('setSegments()', () => {
    const segments = Forger.create<[number, number]>()!;
    //
    model = model.setSegments(segments);
    //
    should().array(model.segments).equal(segments);
  });

  it('setBorderDash()', () => {
    const borderDash = Forger.create<[number, number]>()!;
    //
    model = model.setBorderDash(borderDash);
    //
    should().array(model.borderDash).equal(borderDash);
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
      const other = new ChartLineSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different id', () => {
      const other = new ChartLineSettings().copy(model);
      other.id = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different order', () => {
      const other = new ChartLineSettings().copy(model);
      other.order = Forger.create<number>({ numberMin: 0, numberMax: Number.MAX_VALUE })!;
      //
      should().false(model.isSame(other));
    });

    it('different segments', () => {
      const other = new ChartLineSettings().copy(model);
      other.segments = Forger.create<[number, number]>({ numberMin: 0, numberMax: Number.MAX_VALUE })!;
      //
      should().false(model.isSame(other));
    });

    it('different borderDash', () => {
      const other = new ChartLineSettings().copy(model);
      other.borderDash = Forger.create<[number, number]>({ numberMin: 0, numberMax: Number.MAX_VALUE })!;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = new ChartLineSettings().copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different color', () => {
      const other = new ChartLineSettings().copy(model);
      other.color = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different pointRadius', () => {
      const other = new ChartLineSettings().copy(model);
      other.pointRadius = Forger.create<number>({ numberMin: 0, numberMax: Number.MAX_VALUE })!;
      //
      should().false(model.isSame(other));
    });

    it('different borderWidth', () => {
      const other = new ChartLineSettings().copy(model);
      other.borderWidth = Forger.create<number>({ numberMin: 0, numberMax: Number.MAX_VALUE })!;
      //
      should().false(model.isSame(other));
    });

    it('different fill', () => {
      const other = new ChartLineSettings().copy(model);
      model.fill = false;
      other.fill = Forger.create<'origin' | 'start' | 'end'>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new ChartLineSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
