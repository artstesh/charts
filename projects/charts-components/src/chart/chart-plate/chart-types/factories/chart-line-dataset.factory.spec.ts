import { ChartLineDatasetFactory } from './chart-line-dataset.factory';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartDataset, ScaleOptionsByType } from 'chart.js';
import { ChartLineSettings } from '../line-chart/chart-line.settings';
import { ChartDataModel } from '../../../models';
import { ChartConstants } from '../../../models/chart-constants';
import { IChartDataset } from "../models/i-chart-dataset";

describe('#chart-types ChartLineDatasetModel', () => {
  let settings: ChartLineSettings;
  let scale: IChartDataset<'line', ChartDataModel[]>;
  let data: ChartDataModel[];

  beforeEach(() => {
    data = Forger.create<ChartDataModel[]>()!;
    settings = new ChartLineSettings().copy(Forger.create<ChartLineSettings>()!);
    scale = ChartLineDatasetFactory.build(settings, data);
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
    should().string(scale.type).equals('line');
  });

  it('label is correct', () => {
    should().string(scale.label).equals(settings.name);
  });

  it('backgroundColor is correct', () => {
    should()
      .string(scale.backgroundColor as string)
      .equals(settings.color);
  });

  it('borderColor is correct', () => {
    should()
      .string(scale.borderColor as string)
      .equals(settings.color);
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

  it('pointRadius is correct', () => {
    should()
      .number(scale.pointRadius as number)
      .equals(settings.pointRadius as number);
  });

  it('left yAxisID is correct', () => {
    settings.yLeft = true;
    scale = ChartLineDatasetFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.LeftAxisId);
  });

  it('right yAxisID is correct', () => {
    settings.yLeft = false;
    scale = ChartLineDatasetFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.RightAxisId);
  });
});
