// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { ChartModule } from '../../../chart.module';
import { ChartPlateService } from '../../services/chart-plate.service';
import { Forger } from '@artstesh/forger';
import { DoughnutChartComponent } from './doughnut-chart.component';
import { DoughnutChartFactory } from './doughnut-chart.factory';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { InnerPostboyService } from '../../../services/inner-postboy.service';

describe('#chart-types DoughnutChartComponent', () => {
  let fixture: ComponentFixture<DoughnutChartComponent>;
  const plateService = mock(ChartPlateService);
  const factory = mock(DoughnutChartFactory);
  const postboy = mock(InnerPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe<ChartInitializedEvent>(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(DoughnutChartComponent, ChartModule)
      .provide(MockProvider(InnerPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(DoughnutChartFactory, instance(factory)));
  });

  beforeEach(() => {
    fixture = MockRender(DoughnutChartComponent);
    fixture.componentInstance.data = [];
  });

  afterEach(() => {
    reset(factory);
    reset(postboy);
    reset(plateService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add dataset on chartInitialized', () => {
    const dataset = Forger.create<string>()! as any; // a trick
    when(factory.build(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });
});
