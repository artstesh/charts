import { ChartAxisLimitsModel } from './chart-axis-limits.model';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartDataModel } from './chart-data.model';

describe('#models ChartAxisLimitsModel', () => {
  let model: ChartAxisLimitsModel;

  beforeEach(() => {
    const minX = Forger.create<number>()!;
    const maxX = Forger.create<number>({ numberMin: minX + 100 })!;
    model = new ChartAxisLimitsModel(minX, maxX);
  });

  afterEach(() => {
    expect().nothing();
  });

  describe('rawData', () => {
    it('success', () => {
      should()
        .objects({ ...model }, model.rawData)
        .equal();
    });
  });

  describe('isTheSame()', () => {
    let other: ChartAxisLimitsModel;

    beforeEach(() => {
      other = new ChartAxisLimitsModel(model.minX, model.maxX);
    });

    it('null always false', () => {
      should().false(model.isTheSame(null));
    });

    it('undefined always false', () => {
      should().false(model.isTheSame(undefined));
    });

    it('same objects success', () => {
      should().true(model.isTheSame(other));
    });

    it('minX is different', () => {
      other.minX = model.minX! + Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });

    it('maxX is different', () => {
      other.maxX = model.maxX! + Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });
  });

  describe('contains()', () => {
    it('should true if x&y are included', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>()!,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!,
      };
      //
      should().true(model.contains(dataModel));
    });

    it('should true if data null', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>()!,
        x: Forger.create<number>()!,
      };
      model.minX = model.maxX = null;
      //
      should().true(model.contains(dataModel));
    });

    it('should true if y is null', () => {
      const dataModel: ChartDataModel = {
        y: null,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!,
      };
      //
      should().true(model.contains(dataModel));
    });

    it('should false if x is too big', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>()!,
        x: Forger.create<number>({ numberMin: model.maxX! + 1 })!,
      };
      //
      should().false(model.contains(dataModel));
    });

    it('should false if x is too small', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>()!,
        x: Forger.create<number>({ numberMax: model.minX! - 1 })!,
      };
      //
      should().false(model.contains(dataModel));
    });
  });
});
