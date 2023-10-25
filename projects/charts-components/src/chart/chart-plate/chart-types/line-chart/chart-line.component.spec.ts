// noinspection JSVoidFunctionReturnValueUsed

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartLineComponent } from './chart-line.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { anyString, anything, capture, instance, mock, reset, verify, when } from "ts-mockito";
import { ReplaySubject, Subject } from "rxjs";
import { ChartService } from "../../../services";
import { ChartPlateComponent } from "../../chart-plate.component";
import { ChartDataModel, DateRangeModel } from "../../../models";
import { ChartModule } from "../../../chart.module";
import { ChartAxisLimitService } from "../../../services/chart-axis-limit.service";
import { ChartPlateService } from "../../services/chart-plate.service";
import { should } from "@artstesh/it-should";
import { ChartDataset } from "chart.js";
import { ChartLineSettings } from "./chart-line.settings";
import { Forger } from "@artstesh/forger";
import { SettingsMapService } from "../../../services/settings-map.service";

describe('#chart-types LineChartComponent', () => {
   let fixture: ComponentFixture<ChartLineComponent>;
  let service = mock(ChartService);
  const plateService = mock(ChartPlateService);
  const limitService = mock(ChartAxisLimitService);
  const mapService = mock(SettingsMapService);
  let limitServiceChanged$: Subject<undefined>;
  let chartInitialized: EventEmitter<unknown>;
  let settings: ChartLineSettings;

   beforeEach(async () => {
     settings = new ChartLineSettings().copy(Forger.create<ChartLineSettings>()!);
     limitServiceChanged$ = new Subject<undefined>();
     chartInitialized = new EventEmitter();
     when(plateService.chartInitialized).thenReturn(chartInitialized);
     when(limitService.changed).thenReturn(limitServiceChanged$.asObservable());
     return MockBuilder(ChartLineComponent, ChartModule)
       .provide(MockProvider(ChartPlateService, instance(plateService)))
       .provide(MockProvider(SettingsMapService, instance(mapService)))
       .provide(MockProvider(ChartAxisLimitService, instance(limitService)))
       .provide(MockProvider(ChartService, instance(service)));
   });

   beforeEach(() => {
     fixture = MockRender(ChartLineComponent);
     fixture.componentInstance.settings = settings;
   });

   afterEach(() => {
     reset(mapService);
     reset(plateService);
     reset(limitService);
     expect().nothing();
   })

   it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
   });

  it('should add line on chartInitialized', () => {
    const dataset = Forger.create<number>()! as any; // a trick
    when(mapService.lineDataset(anything(), anything())).thenReturn(dataset);
    //
    chartInitialized.next();
    //
    verify(plateService.addDataset(dataset)).once();
  });

   it('should define backgroundColor', () => {
      chartInitialized.next();
      //
     const [dataset] = capture(plateService.addDataset).last();
      should().string((dataset as ChartDataset<'line'>).backgroundColor as string).equals(settings.color);
   });

   it('should define borderColor', () => {
      chartInitialized.next();
      //
     const [dataset] = capture(plateService.addDataset).last();
      should().string((dataset as ChartDataset<'line'>).borderColor as string).equals(settings.color);
   });

   it('should define pointRadius', () => {
      chartInitialized.next();
      //
     const [dataset] = capture(plateService.addDataset).last();
      should().number((dataset as ChartDataset<'line'>).pointRadius as number).equals(settings.pointRadius as number);
   });

   it('should define type', () => {
      chartInitialized.next();
      //
     const [dataset] = capture(plateService.addDataset).last();
      should().string((dataset as ChartDataset<'line'>).type).equals('line');
   });

   it('should define name', () => {
      chartInitialized.next();
      //
     const [dataset] = capture(plateService.addDataset).last();
      should().string((dataset as ChartDataset<'line'>).label).equals(settings.name);
   });

  it('should define order', () => {
    chartInitialized.next();
    //
    const [dataset] = capture(plateService.addDataset).last();
    should().number((dataset as ChartDataset<'line'>).order).equals(settings.order);
  });
  /*
     it("should add the line's data properly", () => {
        fixture.componentInstance.data = [{ x: new Date(), y: 1 }];
        plateService.chart.data = { datasets: [] };
        //
        fixture.detectChanges();
        //
        const added = plateService.chart.data.datasets[0];
        expect(added.data).toBe(fixture.componentInstance.data);
     });
  */
/*
   it('should add line do not duplicate lines', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      plateService.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: fixture.componentInstance.order }] };
      //
      fixture.detectChanges();
      //
      expect(plateService.chart.data.datasets.length).toBe(1);
   });

   it('should add line do not delete other lines by order', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      plateService.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: Math.floor(Math.random() * 10) }] };
      //
      fixture.detectChanges();
      //
      expect(plateService.chart.data.datasets.length).toBe(2);
   });

   it('should add line do not delete other lines by name', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      plateService.chart.data = { datasets: [{ label: 'Other name', order: fixture.componentInstance.order }] };
      //
      fixture.detectChanges();
      //
      expect(plateService.chart.data.datasets.length).toBe(2);
   });
 */
});
