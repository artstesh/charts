import { ComponentFixture } from '@angular/core/testing';
import { Forger } from '@artstesh/forger';
import { XLinearAxisComponent } from './x-linear-axis.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartAxisLimitService } from '../../../../services/chart-axis-limit.service';
import { should } from '@artstesh/it-should';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { ChartConstants } from '../../../../models/chart-constants';
import { ChartPostboyService } from '../../../../services/chart-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

describe('#chart-elements XLinearAxisComponent', () => {
  let fixture: ComponentFixture<XLinearAxisComponent>;
  const limitService = mock(ChartAxisLimitService);
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(XLinearAxisComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(ChartAxisLimitService, instance(limitService)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(XLinearAxisComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(limitService);
    reset(mapService);
    reset(postboy);
    reset(plateService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the axis on chartInitialized', () => {
    const expectedScale = Forger.create<number>()! as any; // a trick to avoid huge obj creation
    when(mapService.xLinearScale(anything())).thenReturn(expectedScale);
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(ChartConstants.BottomAxisId);
    should().true(scale === expectedScale);
  });
});
