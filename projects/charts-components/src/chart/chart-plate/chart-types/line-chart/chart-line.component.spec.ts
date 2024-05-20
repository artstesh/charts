// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';
import { ChartLineComponent } from './chart-line.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { ChartModule } from '../../../chart.module';
import { ChartPlateService } from '../../services/chart-plate.service';
import { Forger } from '@artstesh/forger';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { should } from '@artstesh/it-should';

describe('#chart-types LineChartComponent', () => {
  let fixture: ComponentFixture<ChartLineComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(ChartLineComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartLineComponent);
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
    const dataset = Forger.create<number>()! as any; // a trick
    when(mapService.lineDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next(new ChartInitializedEvent({} as any));
    //
    const [ds] = capture(plateService.addDataset).last();
    should().true(ds === dataset);
  });
});
