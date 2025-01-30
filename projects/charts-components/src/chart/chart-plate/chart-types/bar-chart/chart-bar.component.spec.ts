// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture } from '@angular/core/testing';

import { ChartBarComponent } from './chart-bar.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { Forger } from '@artstesh/forger';
import { ChartModule } from '../../../chart.module';
import { Subject } from 'rxjs';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { ChartInitializedEvent } from '../../../messages/events/chart-initialized.event';
import { should } from '@artstesh/it-should';

describe('#chart-types ChartBarComponent', () => {
  let fixture: ComponentFixture<ChartBarComponent>;
  const plateService = mock(ChartPlateService);
  const postboy = mock(InnerPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;
  const mapService = mock(SettingsMapService);

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.sub(ChartInitializedEvent)).thenReturn(chartInitialized);
    return MockBuilder(ChartBarComponent, ChartModule)
      .provide(MockProvider(InnerPostboyService, instance(postboy)))
      .provide(MockProvider(ChartPlateService, instance(plateService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartBarComponent);
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
    when(mapService.batDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next(new ChartInitializedEvent({} as any));
    //
    const [ds] = capture(plateService.addDataset).last();
    should().true(ds === dataset);
  });
});
