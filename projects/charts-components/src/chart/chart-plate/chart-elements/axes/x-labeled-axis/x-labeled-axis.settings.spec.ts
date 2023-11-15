import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { XLabeledAxisSettings } from "./x-labeled-axis.settings";
import { ChartAxisLabelModel } from "../../../../models";

describe('#chart-elements XLabeledAxisSettings', () => {
  let model: XLabeledAxisSettings;

  beforeEach(() => {
    model = XLabeledAxisSettings.copy(Forger.create<XLabeledAxisSettings>()!);
    console.log(model);
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('setLimits()', () => {
    it('success', () => {
      const expected = Forger.create<ChartAxisLabelModel[]>()!;
      //
      model = model.setLabels(expected);
      //
      should().array(model.labels).equal(expected);
    });
  });

  describe('copy()', () => {
    it('success', () => {
      const other = XLabeledAxisSettings.copy(model);
      //
      should().objects(model, other).equal();
    });
  });

  describe('setDisplayGrid()', () => {
    it('success', () => {
      const expected = Forger.create<boolean>()!;
      //
      model = model.setDisplayGrid(expected);
      //
      should().true(model.displayGrid === expected);
    });
  });

  describe('isSame()', () => {
    it('are same', () => {
      const other = new XLabeledAxisSettings();
      other.labels = model.labels;
      other.displayGrid = model.displayGrid;
      //
      should().true(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XLabeledAxisSettings();
      other.labels = model.labels;
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different displayGrid', () => {
      const other = new XLabeledAxisSettings();
      other.labels = model.labels;
      other.displayGrid = !model.displayGrid;
      //
      should().false(model.isSame(other));
    });

    it('different limits', () => {
      const other = new XLabeledAxisSettings();
      other.labels = Forger.create<ChartAxisLabelModel[]>()!;
      other.displayGrid = model.displayGrid;
      //
      should().false(model.isSame(other));
    });
  });
});
