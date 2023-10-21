import { ChartAxisLimitsModel } from './chart-axis-limits.model';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartDataModel } from "./chart-data.model";

describe('#models ChartAxisLimitsModel', () => {
  let model: ChartAxisLimitsModel;

  beforeEach(() => {
    const minX = Forger.create<number>()!;
    const minY = Forger.create<number>()!;
    const maxX = Forger.create<number>({ numberMin: minX + 100 })!;
    const maxY = Forger.create<number>({ numberMin: minY + 100 })!;
    model = new ChartAxisLimitsModel(minX, maxX, minY, maxY);
  });

  afterEach(() => {
    expect().nothing();
  });

  describe("rawData", () => {
    it("success", () => {
      should().objects({...model}, model.rawData).equal();
    });
  });

  describe('isTheSame()', () => {
    let other: ChartAxisLimitsModel;

    beforeEach(() => {
      other = new ChartAxisLimitsModel(model.minX, model.maxX, model.minY, model.maxY);
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
      other.minX = Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });

    it('maxX is different', () => {
      other.maxX = Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });

    it('minY is different', () => {
      other.minY = Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });

    it('maxY is different', () => {
      other.maxY = Forger.create<number>()!;
      //
      should().false(model.isTheSame(other));
    });
  });

  describe('contains()', () => {
    it('should true if x&y are included', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>({ numberMin: model.minY! + 1, numberMax: model.maxY! - 1 })!,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!
      }
      //
      should().true(model.contains(dataModel));
    });

    it('should true if data null', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>()!,
        x: Forger.create<number>()!
      }
      model.minX = model.minY = model.maxY = model.maxX = null;
      //
      should().true(model.contains(dataModel));
    });

    it('should true if y is null', () => {
      const dataModel: ChartDataModel = {
        y: null,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!
      }
      //
      should().true(model.contains(dataModel));
    });

    it('should false if x is too big', () => {
      const dataModel: ChartDataModel = {
       y: Forger.create<number>({ numberMin: model.minY! + 1, numberMax: model.maxY! - 1 })!,
       x: Forger.create<number>({ numberMin: model.maxX! + 1 })!
      }
      //
      should().false(model.contains(dataModel));
    });

    it('should false if y is too big', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>({ numberMin: model.maxY! + 1 })!,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!
      }
      //
      should().false(model.contains(dataModel));
    });

    it('should false if x is too small', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>({ numberMin: model.minY! + 1, numberMax: model.maxY! - 1 })!,
        x: Forger.create<number>({ numberMax: model.minX! - 1 })!
      }
      //
      should().false(model.contains(dataModel));
    });

    it('should false if y is too small', () => {
      const dataModel: ChartDataModel = {
        y: Forger.create<number>({ numberMax: model.minY! - 1 })!,
        x: Forger.create<number>({ numberMin: model.minX! + 1, numberMax: model.maxX! - 1 })!
      }
      //
      should().false(model.contains(dataModel));
    });
  });
});
