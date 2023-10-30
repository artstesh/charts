import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartPlateComponent } from './chart-plate.component';
import { ChartModule } from '../chart.module';
import { ChartPlateService } from './services/chart-plate.service';
import { SettingsMapService } from "../services/settings-map.service";

describe('ChartPlateComponent', () => {
  let fixture: ComponentFixture<ChartPlateComponent>;
  const plateService = mock(ChartPlateService);
  let chartInitialized$: EventEmitter<any>;
  const mapService = mock(SettingsMapService);

  beforeEach(async () => {
    chartInitialized$ = new EventEmitter();
    when(plateService.chartInitialized).thenReturn(chartInitialized$);
    return MockBuilder(ChartPlateComponent, ChartModule)
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartPlateComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(plateService);
    expect().nothing();
  })

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe("UI state", () => {

    it('wrapper is shown', () => {
      should().array(ngMocks.findAll('[data-test=chart-plate-wrapper]')).length(1);
    })

    it('canvas is shown', () => {
      should().array(ngMocks.findAll('[data-test=chart-plate]')).length(1);
    })
  });

  // it('should add the axis on chartInitialized', () => {
  //   const expectedScale = Forger.create<number>()!; // a trick to avoid huge obj creation
  //   when(mapService.xLinearScale(anything())).thenReturn(expectedScale as any);
  //   //
  //   chartInitialized$.next();
  //   fixture.detectChanges();
  //   //
  //   const [id, scale] = capture(plateService.setScale).last();
  //   should().string(id).equals(XLinearAxisComponent.id);
  //   should().true(scale === expectedScale);
  // });
});
