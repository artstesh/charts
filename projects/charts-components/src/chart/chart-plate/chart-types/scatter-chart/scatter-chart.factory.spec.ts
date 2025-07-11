import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartConstants } from '../../../models/chart-constants';
import { IChartDataset } from '../models/i-chart-dataset';
import { ScatterChartFactory } from './scatter-chart.factory';
import { ScatterChartSettings } from './scatter-chart.settings';
import { ChartDataModel } from '../../../models';

describe('#chart-types ScatterChartFactory', () => {
  let settings: ScatterChartSettings;
  let scale: IChartDataset<'scatter', ChartDataModel[]>;
  let data: ChartDataModel[];

  beforeEach(() => {
    data = Forger.create<ChartDataModel[]>()!;
    settings = new ScatterChartSettings();
    settings.pointRotation = Forger.create<number>()!;
    scale = ScatterChartFactory.build(settings, data);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should have defined scale', () => {
    should().true(scale);
  });

  it('id is correct', () => {
    should().string(scale.id).equals(settings.id);
  });

  it('type is correct', () => {
    should().string(scale.type).equals('scatter');
  });

  it('label is correct', () => {
    should().string(scale.label).equals(settings.name);
  });

  it('backgroundColor is correct', () => {
    should()
      .string(scale.backgroundColor as string)
      .equals(settings.color);
  });

  it('pointStyle is correct', () => {
    should()
      .string(scale.pointStyle as string)
      .equals(settings.pointStyle as string);
  });

  it('data is correct', () => {
    should().array(scale.data).equal(data);
  });

  it('xAxisID is correct', () => {
    should().string(scale.xAxisID).equals(ChartConstants.BottomAxisId);
  });

  it('order is correct', () => {
    should().number(scale.order).equals(settings.order);
  });

  it('order is correct', () => {
    should()
      .number(scale.pointRadius as number)
      .equals(settings.pointRadius);
  });

  it('pointRotation is correct', () => {
    should()
      .number(scale.pointRotation as number)
      .equals(settings.pointRotation!);
  });

  it('left yAxisID is correct', () => {
    settings.yLeft = true;
    scale = ScatterChartFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.LeftAxisId);
  });

  it('right yAxisID is correct', () => {
    settings.yLeft = false;
    scale = ScatterChartFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.RightAxisId);
  });
});
