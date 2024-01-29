import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartConstants } from '../../../models/chart-constants';
import { BubbleChartSettings } from './bubble-chart.settings';
import { BubbleDataModel } from '../../../models/bubble-data.model';
import { IChartDataset } from '../models/i-chart-dataset';
import { BubbleChartFactory } from './bubble-chart.factory';

describe('#chart-types BubbleChartFactory', () => {
  let settings: BubbleChartSettings;
  let scale: IChartDataset<'bubble', BubbleDataModel[]>;
  let data: BubbleDataModel[];
  let gradient: any;

  beforeEach(() => {
    data = Forger.create<BubbleDataModel[]>()!;
    gradient = Forger.create<string>()!;
    settings = new BubbleChartSettings().copy(Forger.create<BubbleChartSettings>()!);
    scale = BubbleChartFactory.build(settings, data);
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
    should().string(scale.type).equals('bubble');
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
      .equals(settings.borderColor);
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

  it('left yAxisID is correct', () => {
    settings.yLeft = true;
    scale = BubbleChartFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.LeftAxisId);
  });

  it('right yAxisID is correct', () => {
    settings.yLeft = false;
    scale = BubbleChartFactory.build(settings, data);
    //
    should().string(scale.yAxisID).equals(ChartConstants.RightAxisId);
  });
});
