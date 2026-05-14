import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartPlateComponent } from './chart-plate.component';

import { SettingsMapService } from '../services/settings-map.service';
import { InnerPostboyService } from '../services/inner-postboy.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../messages/events/chart-initialized.event';
import { ChartUpdateCommand } from '../messages/commands/chart-update.command';
import { PostboyServiceMock, PostboyWorld } from '@artstesh/postboy-testing';

describe('ChartPlateComponent', () => {
  let fixture: ComponentFixture<ChartPlateComponent>;
  let chartInitialized$: Subject<ChartInitializedEvent>;
  let chartUpdate$: Subject<ChartUpdateCommand>;
  const mapService = mock(SettingsMapService);
  let world: PostboyWorld;

  beforeEach(() => {
    world = new PostboyWorld();
    chartInitialized$ = new Subject<ChartInitializedEvent>();
    chartUpdate$ = new Subject<ChartUpdateCommand>();
    return MockBuilder(ChartPlateComponent)
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .mock(InnerPostboyService, world.postboy);
  });

  beforeEach(() => {
    fixture = MockRender(ChartPlateComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    world.dispose();
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
