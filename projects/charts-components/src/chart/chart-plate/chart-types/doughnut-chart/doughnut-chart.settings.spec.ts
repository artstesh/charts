import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { DoughnutChartSettings } from './doughnut-chart.settings';

describe('#chart-elements DoughnutChartSettings', () => {
  let model: DoughnutChartSettings;

  beforeEach(() => {
    model = DoughnutChartSettings.copy(Forger.create<DoughnutChartSettings>()!);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('ids are different', () => {
    const settings1 = new DoughnutChartSettings();
    const settings2 = new DoughnutChartSettings();
    //
    should().string(settings1.id).not.equals(settings2.id);
  });

  it('names are different', () => {
    const settings1 = new DoughnutChartSettings();
    const settings2 = new DoughnutChartSettings();
    //
    should().string(settings1.name).not.equals(settings2.name);
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
      const other = DoughnutChartSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different id', () => {
      const other = new DoughnutChartSettings();
      other.name = model.name;
      //
      should().false(model.isSame(other));
    });

    it('different name', () => {
      const other = DoughnutChartSettings.copy(model);
      other.name = Forger.create<string>()!;
      //
      should().false(model.isSame(other));
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const result = DoughnutChartSettings.copy(model);
      //
      should().objects(result, model).equal();
    });
  });
});
