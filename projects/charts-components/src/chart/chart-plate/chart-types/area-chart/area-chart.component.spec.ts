import { ComponentFixture } from '@angular/core/testing';
import { AreaChartComponent } from './area-chart.component';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { ChartUpdateCommand } from '../../../messages/commands/chart-update.command';
import { BuildAreaChartExecutor } from '../../../messages/executors/build-area-chart.executor';
import { AreaBuilderModel } from '../models/area-builder.model';
import { ChartRenderedEvent } from '../../../messages/events/chart-rendered.event';

describe('AreaChartComponent', () => {
  let fixture: ComponentFixture<AreaChartComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;
  let chartRendered: Subject<ChartRenderedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    chartRendered = new Subject<ChartRenderedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    when(postboy.subscribe(ChartRenderedEvent.ID)).thenReturn(chartRendered);
    when(postboy.execute<BuildAreaChartExecutor, AreaBuilderModel>(anything())).thenReturn({ bottom: {}, top: {} });
    return MockBuilder(AreaChartComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)));
  });

  beforeEach(() => {
    fixture = MockRender(AreaChartComponent);
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

  it('should add line on chartInitialized', () => {
    //
    chartInitialized.next(new ChartInitializedEvent({} as any));
    //
    verify(plateService.addDataset(anything())).never();
  });

  it('should add line on chartInitialized', () => {
    //
    chartInitialized.next(new ChartInitializedEvent({} as any));
    chartRendered.next(new ChartUpdateCommand());
    //
    verify(plateService.addDataset(anything())).twice();
  });
});
