import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarComponent } from './chart-bar.component';
import { ChartPlateComponent } from '../../chart-plate.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { anyString, instance, mock, reset, verify, when } from "ts-mockito";
import { Forger } from '@artstesh/forger';
import Chart from 'chart.js';
import { ChartModule } from "../../../chart.module";
import { ChartService } from "../../../services";
import { ChartAxisLimitService } from "../../../services/chart-axis-limit.service";
import { Subject } from "rxjs";

describe('#chart-types ChartBarComponent', () => {
   let fixture: ComponentFixture<ChartBarComponent>;
  let service = mock(ChartService);
  const parent = mock(ChartPlateComponent);
  const limitService = mock(ChartAxisLimitService);
  let limitServiceChanged$: Subject<undefined>;
  let chartInitialized: EventEmitter<unknown>;
  let chart: any;
  const color = '#000';

   beforeEach(async () => {
     limitServiceChanged$ = new Subject<undefined>();
     chart = { options: { plugins: {} }, data: {datasets: []} };
     chartInitialized = new EventEmitter();
     when(parent.chart).thenReturn(chart);
     when(parent.chartInitialized).thenReturn(chartInitialized);
     when(limitService.changed).thenReturn(limitServiceChanged$.asObservable());
     when(service.getRandomColor(anyString())).thenReturn(color);
      return MockBuilder(ChartBarComponent, ChartModule)
        .provide(MockProvider(ChartPlateComponent, instance(parent)))
        .provide(MockProvider(ChartAxisLimitService, instance(limitService)))
        .provide(MockProvider(ChartService, instance(service)));
   });

   beforeEach(() => {
      fixture = MockRender(ChartBarComponent);
   });

   afterEach(() => {
     reset(parent);
     reset(limitService);
      reset(parent);
   });

   it('should create', () => {
      const component = ngMocks.findInstances(ChartBarComponent)[0];
      //
      expect(component).toBeTruthy();
   });

   it('should add bar on ngOnChanges', () => {
      const component = ngMocks.findInstances(ChartBarComponent)[0];
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(1);
      verify(parent.updateChart(false)).twice();
   });

   it("should add bar's type properly", () => {
      const component = ngMocks.findInstances(ChartBarComponent)[0];
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.type).toBe('bar');
   });

   it("should add the bar's data properly", () => {
      fixture.componentInstance.data = [{ x: 0, y: 1 }];
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.data).toBe(fixture.componentInstance.data);
   });

   it("should add the bar's name properly", () => {
      fixture.componentInstance._settings.name = Math.floor(Math.random() * 16777215).toString(16);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.label).toBe(fixture.componentInstance._settings.name);
   });

   it("should add the bar's color properly", () => {
      fixture.componentInstance._settings.color = Math.floor(Math.random() * 16777215).toString(16);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.backgroundColor).toBe(fixture.componentInstance._settings.color);
   });

   it("should add the bar's yAxisId properly", () => {
      fixture.componentInstance.yAxisId = Math.floor(Math.random() * 16777215).toString(16);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.yAxisID).toBe(fixture.componentInstance.yAxisId);
   });

   it("should add the bar's order properly", () => {
      fixture.componentInstance._settings.order = Math.floor(Math.random() * 16777215);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.order).toBe(fixture.componentInstance._settings.order);
   });

   it('should not duplicate bars', () => {
      fixture.componentInstance._settings.name = 'Some name';
      fixture.componentInstance._settings.order = 0;
      chart.data = {
         datasets: [{ label: fixture.componentInstance._settings.name, order: fixture.componentInstance._settings.order } as any]
      };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(1);
   });

   it('should not delete other bars by order', () => {
      fixture.componentInstance._settings.name = 'Some name';
      fixture.componentInstance._settings.order = 0;
      chart.data = { datasets: [{ label: fixture.componentInstance._settings.name, order: Forger.create<number>()! } as any] };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(2);
   });

   it('should not delete other bars by name', () => {
      fixture.componentInstance._settings.name = 'Some name';
      fixture.componentInstance._settings.order = 0;
      chart.data = { datasets: [{ label: 'Other name', order: fixture.componentInstance._settings.order } as any] };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(2);
   });
});
