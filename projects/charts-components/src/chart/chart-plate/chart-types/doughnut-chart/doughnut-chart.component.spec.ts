// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { ChartModule } from '../../../chart.module';
import { ChartPlateService } from '../../services/chart-plate.service';
import { Forger } from '@artstesh/forger';
import { DoughnutChartComponent } from './doughnut-chart.component';
import { DoughnutChartFactory } from './doughnut-chart.factory';

describe('#chart-types DoughnutChartComponent', () => {
  let fixture: ComponentFixture<DoughnutChartComponent>;
  const plateService = mock(ChartPlateService);
  const factory = mock(DoughnutChartFactory);
  let chartInitialized: EventEmitter<unknown>;

  beforeEach(async () => {
    chartInitialized = new EventEmitter();
    when(plateService.chartInitialized).thenReturn(chartInitialized);
    return MockBuilder(DoughnutChartComponent, ChartModule)
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(DoughnutChartFactory, instance(factory)));
  });

  beforeEach(() => {
    fixture = MockRender(DoughnutChartComponent);
    fixture.componentInstance.data = [];
  });

  afterEach(() => {
    reset(factory);
    reset(plateService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add dataset on chartInitialized', () => {
    const dataset = Forger.create<number>()! as any; // a trick
    when(factory.build(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });
});
