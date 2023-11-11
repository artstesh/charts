import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartLineSettings } from './chart-line.settings';

describe('#chart-elements ChartLineSettings', () => {
  let model: ChartLineSettings;

  beforeEach(() => {
    model = new ChartLineSettings().copy(Forger.create<ChartLineSettings>()!);
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

  it('setPointRadius()', () => {
    const radius = Forger.create<number>()!;
    //
    model = model.setPointRadius(radius);
    //
    should()
      .number(model.pointRadius as number)
      .equals(radius);
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
      other.order = Forger.create<number>()!;
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
      other.pointRadius = Forger.create<number>()!;
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
