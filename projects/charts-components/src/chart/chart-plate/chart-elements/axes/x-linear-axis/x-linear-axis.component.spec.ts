import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { Forger } from '@artstesh/forger';
import { XLinearAxisComponent } from './x-linear-axis.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartAxisLimitService } from '../../../../services/chart-axis-limit.service';
import { should } from '@artstesh/it-should';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';

describe('#chart-elements XLinearAxisComponent', () => {
  let fixture: ComponentFixture<XLinearAxisComponent>;
  const limitService = mock(ChartAxisLimitService);
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  let chartInitialized$: EventEmitter<any>;

  beforeEach(async () => {
    chartInitialized$ = new EventEmitter();
    when(plateService.chartInitialized).thenReturn(chartInitialized$);
    return MockBuilder(XLinearAxisComponent, ChartModule)
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
    chartInitialized$.next();
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(XLinearAxisComponent.id);
    should().true(scale === expectedScale);
  });
});
