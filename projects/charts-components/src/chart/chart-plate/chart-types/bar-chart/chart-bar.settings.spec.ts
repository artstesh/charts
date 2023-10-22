import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartBarSettings } from "./chart-bar.settings";

describe('#chart-elements ChartBarSettings', () => {
  let model: ChartBarSettings;

  beforeEach(() => {
    model = new ChartBarSettings().copy(Forger.create<ChartBarSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new ChartBarSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different order', () => {
      const other = new ChartBarSettings().copy(model);
      other.order = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = new ChartBarSettings().copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different color', () => {
      const other = new ChartBarSettings().copy(model);
      other.color = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });

    it('different thickness', () => {
      const other = new ChartBarSettings().copy(model);
      other.thickness = Forger.create<number>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new ChartBarSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
