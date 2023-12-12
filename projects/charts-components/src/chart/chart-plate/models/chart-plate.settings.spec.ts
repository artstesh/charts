import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartPlateSettings } from './chart-plate.settings';

describe('ChartPlateSettings', () => {
  let model: ChartPlateSettings;

  beforeEach(() => {
    model = new ChartPlateSettings().copy(Forger.create<ChartPlateSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('setMode()', () => {
    const expected = Forger.create<'x' | 'y'>()!;
    //
    const result = model.setMode(expected);
    //
    should().string(result.interactionMode).equals(expected);
  });

  it('setType()', () => {
    const expected = Forger.create<string>()! as any;
    //
    const result = model.setType(expected);
    //
    should().string(result.type).equals(expected);
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new ChartPlateSettings().copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different interactionMode', () => {
      const other = new ChartPlateSettings().copy(model);
      other.interactionMode = Forger.create<'x' | 'y'>()!;
      //
      should().false(model.isSame(other));
    });

    it('different type', () => {
      const other = new ChartPlateSettings().copy(model);
      other.type = Forger.create<string>()! as any;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = new ChartPlateSettings().copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
