// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';
import { ChartLineComponent } from './chart-line.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { ChartModule } from '../../../chart.module';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { ChartPlateService } from '../../services/chart-plate.service';
import { Forger } from '@artstesh/forger';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';

describe('#chart-types LineChartComponent', () => {
  let fixture: ComponentFixture<ChartLineComponent>;
  const plateService = mock(ChartPlateService);
  const limitService = mock(ChartAxisLimitService);
  const mapService = mock(SettingsMapService);
  let limitServiceChanged$: Subject<undefined>;
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    limitServiceChanged$ = new Subject<undefined>();
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    when(limitService.changed).thenReturn(limitServiceChanged$.asObservable());
    return MockBuilder(ChartLineComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartAxisLimitService, instance(limitService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartLineComponent);
  });

  afterEach(() => {
    reset(mapService);
    reset(plateService);
    reset(postboy);
    reset(limitService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add line on chartInitialized', () => {
    const dataset = Forger.create<number>()! as any; // a trick
    when(mapService.lineDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });
});
