import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartPlateComponent } from './chart-plate.component';
import { ChartModule } from '../chart.module';
import { SettingsMapService } from '../services/settings-map.service';
import { InnerPostboyService } from '../services/inner-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';

describe('ChartPlateComponent', () => {
  let fixture: ComponentFixture<ChartPlateComponent>;
  const postboy = mock(InnerPostboyService);
  let chartInitialized$: Subject<ChartInitializedEvent>;
  let chartUpdate$: Subject<ChartUpdateCommand>;
  const mapService = mock(SettingsMapService);

  beforeEach(async () => {
    chartInitialized$ = new Subject<ChartInitializedEvent>();
    chartUpdate$ = new Subject<ChartUpdateCommand>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized$);
    when(postboy.subscribe(ChartUpdateCommand.ID)).thenReturn(chartUpdate$);
    return MockBuilder(ChartPlateComponent, ChartModule)
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(InnerPostboyService, instance(postboy)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartPlateComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(postboy);
    reset(mapService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('UI state', () => {
    it('wrapper is shown', () => {
      should().array(ngMocks.findAll('[data-test=chart-plate-wrapper]')).length(1);
    });

    it('canvas is shown', () => {
      should().array(ngMocks.findAll('[data-test=chart-plate]')).length(1);
    });
  });
});
