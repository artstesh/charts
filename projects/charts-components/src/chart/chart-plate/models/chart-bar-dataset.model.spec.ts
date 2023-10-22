import { Forger } from "@artstesh/forger";
import { ChartDataModel } from "../../models";
import { should } from "@artstesh/it-should";
import { ChartDataset } from "chart.js";
import { ChartConstants } from "../../models/chart-constants";
import { ChartBarDatasetModel } from "./chart-bar-dataset.model";

describe("ChartBarDatasetModel", () => {
  describe("being created successfully", () => {
    let model: ChartDataset<'bar'>;
    let label: string;
    let data: ChartDataModel[];

    beforeEach(() => {
      label = Forger.create<string>()!;
      data = Forger.create<ChartDataModel[]>()!;
      model = new ChartBarDatasetModel(label, data).build() as ChartDataset<'bar'>;
    });

    it("type is correct", () => {
      //
      should().string(model.type).equals('bar');
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
      should().string(model.xAxisID).equals(ChartConstants.BottomAxisName);
    });

    it("yAxisID is correct", () => {
      //
      should().string(model.yAxisID).equals(ChartConstants.LeftAxisName);
    });
  });

  afterEach(() => {
    expect().nothing();
  });

  describe("additional properties", () => {
    let model: ChartBarDatasetModel;

    beforeEach(() => {
      model = new ChartBarDatasetModel(Forger.create<string>()!, Forger.create<ChartDataModel[]>()!);
    });

    it("order()", () => {
      const order = Forger.create<number>()!;
      //
      const result = model.order(order).build() as ChartDataset<'bar'>;
      //
      should().number(result.order).equals(order);
    });

    it("backColor()", () => {
      const color = Forger.create<string>()!;
      //
      const result = model.backColor(color).build() as ChartDataset<'bar'>;
      //
      should().string(result.backgroundColor as string).equals(color);
    });

    it("thickness()", () => {
      const color = Forger.create<number>()!;
      //
      const result = model.thickness(color).build() as ChartDataset<'bar'>;
      //
      should().number(result.barThickness as number).equals(color);
    });

    it("rightAxis()", () => {
      const result = model.rightAxis().build() as ChartDataset<'bar'>;
      //
      should().string(result.yAxisID).equals(ChartConstants.RightAxisName);
    });
  });
});
