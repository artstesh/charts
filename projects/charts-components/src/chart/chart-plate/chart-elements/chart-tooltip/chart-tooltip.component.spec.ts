import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { Forger } from '@artstesh/forger';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartTooltipComponent } from './chart-tooltip.component';
import { ChartPlateService } from '../../services/chart-plate.service';
import { SettingsMapService } from '../../../services/settings-map.service';
import { ChartModule } from '../../../chart.module';
import { ChartPostboyService } from "../../../services/chart-postboy.service";
import { Subject } from "rxjs";
import { ChartInitializedEvent } from "../../../messages/events/chart-initialized.event";

describe('#chart-elements XLinearAxisComponent', () => {
  let fixture: ComponentFixture<ChartTooltipComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(ChartTooltipComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartTooltipComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(mapService);
    reset(plateService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the tooltip on chartInitialized', () => {
    const expectedTooltip = Forger.create<number>()!; // a trick to avoid huge obj creation
    when(mapService.tooltip(anything())).thenReturn(expectedTooltip as any);
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    const [tooltip] = capture(plateService.setTooltip).last();
    should().true(tooltip === expectedTooltip);
  });
});
