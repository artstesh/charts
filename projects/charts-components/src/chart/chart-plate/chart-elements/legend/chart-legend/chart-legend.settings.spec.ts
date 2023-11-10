import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartLegendDirection, ChartLegendPosition, ChartLegendSettings } from "./chart-legend.settings";

describe('#chart-elements ChartLegendSettings', () => {
  let model: ChartLegendSettings;

  beforeEach(() => {
    model = new ChartLegendSettings();
    model.direction = Forger.create<'row' | 'column'>()!;
    model.position = Forger.create<'top' | 'right' | 'bottom' | 'left'>()!;
  });

  afterEach(() => {
    expect().nothing();
  });

  describe("copy()", () => {
    it("success", () => {
      const other = ChartLegendSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe("setDirection()", () => {
    it("success", () => {
      const expected = Forger.create<'row' | 'column'>()!;
      //
      model.setDirection(expected);
      //
      should().string(model.direction).equals(expected);
    });
  });

  describe("setPosition()", () => {
    it("success", () => {
      const expected = Forger.create<'bottom' | 'left' | 'top' | 'right'>()!;
      //
      model.setPosition(expected)
      //
      should().string(model.position).equals(expected);
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = ChartLegendSettings.copy(model);
      //
      should().true(model.isSame(other));
    });

    it('different direction', () => {
      const other = ChartLegendSettings.copy(model);
      model.direction = 'column';
      other.direction = 'row';
      //
      should().false(model.isSame(other));
    });

    it('different position', () => {
      const other = ChartLegendSettings.copy(model);
      model.position = Forger.create<'bottom' | 'left'>()!;
      other.position = Forger.create<'top' | 'right'>()!;
      //
      should().false(model.isSame(other));
    });
  });
});
