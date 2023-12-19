import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { OrdinateAxisSettings } from './ordinate-axis.settings';
import { ChartConstants } from '../../../../models/chart-constants';

describe('#chart-elements OrdinateAxisSettings', () => {
  let model: OrdinateAxisSettings;

  beforeEach(() => {
    model = OrdinateAxisSettings.copy(Forger.create<OrdinateAxisSettings>()!);
    console.log(model);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('setDisplayGrid()', () => {
    const expected = Forger.create<boolean>()!;
    //
    model = model.setDisplayGrid(expected);
    //
    should().true(model.displayGrid === expected);
  });

  it('setRight()', () => {
    const expected = Forger.create<boolean>()!;
    //
    model = model.setRight(expected);
    //
    should().true(model.right === expected);
  });

  [
    { value: true, expected: ChartConstants.RightAxisId },
    { value: false, expected: ChartConstants.LeftAxisId },
  ].forEach((e) => {
    it(`getAxisId(), right - ${e.value}`, () => {
      model.right = e.value;
      //
      should().string(model.getAxisId()).equals(e.expected);
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const other = OrdinateAxisSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = OrdinateAxisSettings.copy(model);
      //
      should().true(model.isSame(other));
      should().objects(model, other).ignoring('getAxisId').equal();
    });

    it('different displayGrid', () => {
      const other = OrdinateAxisSettings.copy(model);
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different right', () => {
      const other = OrdinateAxisSettings.copy(model);
      other.right = !model.right;
      //
      should().false(model.isSame(other));
    });
  });
});
