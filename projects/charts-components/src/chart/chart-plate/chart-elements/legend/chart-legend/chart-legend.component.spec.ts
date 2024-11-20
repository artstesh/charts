import { ComponentFixture } from '@angular/core/testing';
import { ChartLegendComponent } from './chart-legend.component';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';

describe('#chart-elements ChartLegendComponent', () => {
  let fixture: ComponentFixture<ChartLegendComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(InnerPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(ChartLegendComponent, ChartModule)
      .provide(MockProvider(InnerPostboyService, instance(postboy)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartLegendComponent);
    fixture.detectChanges();
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

  it('should add the axis on chartInitialized', () => {
    const expectedLegend = Forger.create<number>()! as any; // a trick to avoid huge obj creation
    when(mapService.chartLegend(anything(), anything())).thenReturn(expectedLegend);
    //
    chartInitialized.next(new ChartInitializedEvent(null as any));
    fixture.detectChanges();
    //
    const [legend] = capture(plateService.setLegend).last();
    should().true(legend === expectedLegend);
  });
});
