import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartTooltipSettings } from './chart-tooltip.settings';

describe('#chart-elements ChartTooltipSettings', () => {
  let model: ChartTooltipSettings;

  beforeEach(() => {
    model = ChartTooltipSettings.copy(Forger.create<ChartTooltipSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('copy()', () => {
    const other = ChartTooltipSettings.copy(model);
    //
    should().objects(model, other).equal();
  });

  describe('setters', () => {
    it('setSkipDatasets()', () => {
      const expected = Forger.create<string[]>()!;
      //
      model = model.setSkipDatasets(expected);
      //
      should().array(model.skipDatasets).equal(expected);
    });

    it('setContent()', () => {
      const expected = Forger.create<string>()! as any;
      //
      model = model.setContent(expected);
      //
      should()
        .string(model.content as any)
        .equals(expected);
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = ChartTooltipSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different content', () => {
      const other = ChartTooltipSettings.copy(model);
      other.content = Forger.create<string>()! as any;
      //
      should().false(model.isSame(other));
    });

    it('different skipDatasets', () => {
      const other = ChartTooltipSettings.copy(model);
      other.skipDatasets = Forger.create<string[]>()!;
      //
      should().false(model.isSame(other));
    });
  });
});
