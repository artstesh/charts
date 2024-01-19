import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartAreaDataModel } from '../../../models';
import { ChartConstants } from '../../../models/chart-constants';
import { AreaChartFactory } from './area-chart.factory';
import { AreaChartSettings } from './area-chart.settings';
import { AreaBuilderModel } from '../models/area-builder.model';

describe('#chart-types AreaChartFactory', () => {
  let settings: AreaChartSettings;
  let scale: AreaBuilderModel;
  let data: ChartAreaDataModel[];
  let gradient: any;

  beforeEach(() => {
    data = Forger.create<ChartAreaDataModel[]>()!;
    gradient = Forger.create<string>()!;
    settings = new AreaChartSettings().copy(Forger.create<AreaChartSettings>()!);
    scale = AreaChartFactory.build(settings, data, gradient);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined scale', () => {
    should().true(scale);
  });

  it('id is correct', () => {
    should().string(scale.top.id).equals(settings.id);
    should().string(scale.bottom.id).equals(`${ChartConstants.AreaMatePrefix}${settings.id}`);
  });

  it('type is correct', () => {
    should().string(scale.top.type).equals('area');
    should().string(scale.bottom.type).equals('area');
  });

  it('label is correct', () => {
    should().string(scale.top.label).equals(settings.name);
    should().string(scale.bottom.label).equals(`${ChartConstants.AreaMatePrefix}${settings.name}`);
  });

  it('backgroundColor is correct', () => {
    should()
      .string(scale.top.backgroundColor as string)
      .equals(gradient);
    should()
      .string(scale.bottom.backgroundColor as string)
      .equals(gradient);
  });

  it('borderColor is correct', () => {
    should()
      .string(scale.top.borderColor as string)
      .equals('transparent');
    should()
      .string(scale.bottom.borderColor as string)
      .equals('transparent');
  });

  it('data is correct', () => {
    should().array(scale.top.data).equal(data);
    should()
      .array(scale.bottom.data.map((e: ChartAreaDataModel) => e.x))
      .equal(data.map((e) => e.x));
    should()
      .array(scale.bottom.data.map((e: ChartAreaDataModel) => e.y))
      .equal(data.map((e) => e.y2));
    should()
      .array(scale.bottom.data.map((e: ChartAreaDataModel) => e.y2))
      .equal(data.map((e) => e.y));
  });

  it('xAxisID is correct', () => {
    should().string(scale.top.xAxisID).equals(ChartConstants.BottomAxisId);
    should().string(scale.bottom.xAxisID).equals(ChartConstants.BottomAxisId);
  });

  it('order is correct', () => {
    should().number(scale.top.order).equals(settings.order);
    should().number(scale.bottom.order).equals(settings.order);
  });

  it('left yAxisID is correct', () => {
    settings.yLeft = true;
    scale = AreaChartFactory.build(settings, data, gradient);
    //
    should().string(scale.top.yAxisID).equals(ChartConstants.LeftAxisId);
    should().string(scale.bottom.yAxisID).equals(ChartConstants.LeftAxisId);
  });

  it('right yAxisID is correct', () => {
    settings.yLeft = false;
    scale = AreaChartFactory.build(settings, data, gradient);
    //
    should().string(scale.top.yAxisID).equals(ChartConstants.RightAxisId);
    should().string(scale.bottom.yAxisID).equals(ChartConstants.RightAxisId);
  });
});
