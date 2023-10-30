import { ChartBarSettings } from "../bar-chart/chart-bar.settings";
import { ChartDataset } from "chart.js";
import { ChartDataModel } from "../../../models";
import { Forger } from "@artstesh/forger";
import { ChartBarDatasetFactory } from "./chart-bar-dataset.factory";
import { should } from "@artstesh/it-should";
import { ChartConstants } from "../../../models/chart-constants";


describe("#chart-types ChartLineDatasetModel", () => {
  let settings: ChartBarSettings;
  let scale: ChartDataset<'bar', ChartDataModel[]>;
  let data: ChartDataModel[];

  beforeEach(() => {
    data = Forger.create<ChartDataModel[]>()!;
    settings = new ChartBarSettings().copy(Forger.create<ChartBarSettings>()!);
    scale = ChartBarDatasetFactory.build(settings, data);
  });

  afterEach(() => {
    expect().nothing();
  });

  it("should have defined scale", () => {
    should().true(scale);
  });

  it("type is correct", () => {
    should().string(scale.type).equals('bar');
  });

  it("label is correct", () => {
    should().string(scale.label).equals(settings.name);
  });

  it("backgroundColor is correct", () => {
    should().string(scale.backgroundColor as string).equals(settings.color);
  });

  it("data is correct", () => {
    should().array(scale.data).equal(data);
  });

  it("xAxisID is correct", () => {
    should().string(scale.xAxisID).equals(ChartConstants.BottomAxisId);
  });

  it("order is correct", () => {
    should().number(scale.order).equals(settings.order);
  });

  it("barThickness is correct", () => {
    should().number(scale.barThickness as number).equals(settings.thickness!);
  });

  it("left yAxisID is correct", () => {
    settings.yLeft = true;
    scale = ChartBarDatasetFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.LeftAxisId);
  });

  it("right yAxisID is correct", () => {
    settings.yLeft = false;
    scale = ChartBarDatasetFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.RightAxisId);
  });
});
