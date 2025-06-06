// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { instance, mock, reset, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { ChartModule } from '../../../chart.module';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { ScatterChartComponent } from './scatter-chart.component';

describe('#chart-types ScatterChartComponent', () => {
  let fixture: ComponentFixture<ScatterChartComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(InnerPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.sub(ChartInitializedEvent)).thenReturn(chartInitialized);
    return MockBuilder(ScatterChartComponent, ChartModule)
      .provide(MockProvider(InnerPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)));
  });

  beforeEach(() => {
    fixture = MockRender(ScatterChartComponent);
  });

  afterEach(() => {
    reset(mapService);
    reset(plateService);
    reset(postboy);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
