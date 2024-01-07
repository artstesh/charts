// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';

import { ChartBarComponent } from './chart-bar.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { Forger } from '@artstesh/forger';
import { ChartModule } from '../../../chart.module';
import { ChartAxisLimitService } from '../../../services/chart-axis-limit.service';
import { Subject } from 'rxjs';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ChartLimitEvent } from '../../../messages/events/chart-limit.event';

describe('#chart-types ChartBarComponent', () => {
  let fixture: ComponentFixture<ChartBarComponent>;
  const plateService = mock(ChartPlateService);
  const limitService = mock(ChartAxisLimitService);
  let limitServiceChanged$: Subject<undefined>;
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;
  const mapService = mock(SettingsMapService);

  beforeEach(async () => {
    limitServiceChanged$ = new Subject<undefined>();
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    when(postboy.subscribe(ChartLimitEvent.ID)).thenReturn(limitServiceChanged$);
    return MockBuilder(ChartBarComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartAxisLimitService, instance(limitService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartBarComponent);
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
    when(mapService.batDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });
});
