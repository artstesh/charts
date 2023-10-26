// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarComponent } from './chart-bar.component';
import { ChartPlateComponent } from '../../chart-plate.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { anyString, anything, instance, mock, reset, verify, when } from "ts-mockito";
import { Forger } from '@artstesh/forger';
import Chart from 'chart.js';
import { ChartModule } from "../../../chart.module";
import { ChartService } from "../../../services";
import { ChartAxisLimitService } from "../../../services/chart-axis-limit.service";
import { Subject } from "rxjs";
import { ChartPlateService } from "../../services/chart-plate.service";
import { ChartLineSettings } from "../line-chart/chart-line.settings";
import { ChartBarSettings } from "./chart-bar.settings";
import { SettingsMapService } from "../../../services/settings-map.service";

describe('#chart-types ChartBarComponent', () => {
   let fixture: ComponentFixture<ChartBarComponent>;
  let service = mock(ChartService);
  const plateService = mock(ChartPlateService);
  const limitService = mock(ChartAxisLimitService);
  let limitServiceChanged$: Subject<undefined>;
  let chartInitialized: EventEmitter<unknown>;
  const mapService = mock(SettingsMapService);

   beforeEach(async () => {
     limitServiceChanged$ = new Subject<undefined>();
     chartInitialized = new EventEmitter();
     when(plateService.chartInitialized).thenReturn(chartInitialized);
     when(limitService.changed).thenReturn(limitServiceChanged$.asObservable());
      return MockBuilder(ChartBarComponent, ChartModule)
        .provide(MockProvider(ChartPlateService, instance(plateService)))
        .provide(MockProvider(SettingsMapService, instance(mapService)))
        .provide(MockProvider(ChartAxisLimitService, instance(limitService)))
        .provide(MockProvider(ChartService, instance(service)));
   });

   beforeEach(() => {
      fixture = MockRender(ChartBarComponent);
   });

   afterEach(() => {
     reset(mapService);
     reset(plateService);
     reset(limitService);
   });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add line on chartInitialized', () => {
    const dataset = Forger.create<number>()! as any; // a trick
    when(mapService.batDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });
});
