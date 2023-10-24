import { ChartLineDatasetFactory } from "./chart-line-dataset.factory";
import { Forger } from "@artstesh/forger";
import { ChartDataModel } from "../../models";
import { should } from "@artstesh/it-should";
import { ChartDataset } from "chart.js";
import { ChartConstants } from "../../models/chart-constants";

describe("ChartLineDatasetModel", () => {
  describe("being created successfully", () => {
    let model: ChartDataset<'line'>;
    let label: string;
    let data: ChartDataModel[];

    beforeEach(() => {
      label = Forger.create<string>()!;
      data = Forger.create<ChartDataModel[]>()!;
      model = new ChartLineDatasetFactory(label, data).build() as ChartDataset<'line'>;
    });

    it("type is correct", () => {
      //
      should().string(model.type).equals('line');
    });

    it("label is correct", () => {
      //
      should().string(model.label).equals(label);
    });

    it("data is correct", () => {
      //
      should().array(model.data as any).equal(data);
    });

    it("xAxisID is correct", () => {
      //
      should().string(model.xAxisID).equals(ChartConstants.BottomAxisId);
    });

    it("yAxisID is correct", () => {
      //
      should().string(model.yAxisID).equals(ChartConstants.LeftAxisId);
    });
  });

  afterEach(() => {
    expect().nothing();
  });

  describe("additional properties", () => {
    let model: ChartLineDatasetFactory;

    beforeEach(() => {
      model = new ChartLineDatasetFactory(Forger.create<string>()!, Forger.create<ChartDataModel[]>()!);
    });

    it("order()", () => {
      const order = Forger.create<number>()!;
      //
      const result = model.order(order).build() as ChartDataset<'line'>;
      //
      should().number(result.order).equals(order);
    });

    it("pointRadius()", () => {
      const radius = Forger.create<number>()!;
      //
      const result = model.pointRadius(radius).build() as ChartDataset<'line'>;
      //
      should().number(result.pointRadius as number).equals(radius);
    });

    it("backColor()", () => {
      const color = Forger.create<string>()!;
      //
      const result = model.backColor(color).build() as ChartDataset<'line'>;
      //
      should().string(result.backgroundColor as string).equals(color);
    });

    it("rightAxis()", () => {
      const result = model.rightAxis().build() as ChartDataset<'line'>;
      //
      should().string(result.yAxisID).equals(ChartConstants.RightAxisId);
    });
  });
});
