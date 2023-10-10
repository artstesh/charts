import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarComponent } from './chart-bar.component';
import { ChartPlateComponent } from '../../chart-plate.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { ChartPointTooltipComponent } from '@cdk/chart/chart-plate/chart-elements/chart-tooltip';
import { ChartModule } from '@cdk';
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Forger } from '@artstesh/forger';
import Chart from 'chart.js';

describe('ChartBarComponent', () => {
   let fixture: ComponentFixture<ChartBarComponent>;
   const parent = mock(ChartPlateComponent);
   let chartInitialized: EventEmitter<unknown>;
   let chart: any;

   beforeEach(async () => {
      chart = { data: { datasets: [] } };
      chartInitialized = new EventEmitter();
      when(parent.chartInitialized).thenReturn(chartInitialized);
      when(parent.chart).thenReturn(chart);
      return MockBuilder(ChartBarComponent, ChartModule).provide(MockProvider(ChartPlateComponent, instance(parent)));
   });

   beforeEach(() => {
      fixture = MockRender(ChartBarComponent);
   });

   afterEach(() => {
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
      fixture.componentInstance.data = [{ x: new Date(), y: 1 }];
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.data).toBe(fixture.componentInstance.data);
   });

   it("should add the bar's name properly", () => {
      fixture.componentInstance.name = Math.floor(Math.random() * 16777215).toString(16);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.label).toBe(fixture.componentInstance.name);
   });

   it("should add the bar's color properly", () => {
      fixture.componentInstance.color = Math.floor(Math.random() * 16777215).toString(16);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.backgroundColor).toBe(fixture.componentInstance.color);
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
      fixture.componentInstance.order = Math.floor(Math.random() * 16777215);
      chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = chart.data.datasets[0];
      expect(added.order).toBe(fixture.componentInstance.order);
   });

   it('should not duplicate bars', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      chart.data = {
         datasets: [{ label: fixture.componentInstance.name, order: fixture.componentInstance.order } as any]
      };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(1);
   });

   it('should not delete other bars by order', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      chart.data = { datasets: [{ label: fixture.componentInstance.name, order: Forger.create<number>()! } as any] };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(2);
   });

   it('should not delete other bars by name', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      chart.data = { datasets: [{ label: 'Other name', order: fixture.componentInstance.order } as any] };
      //
      fixture.detectChanges();
      //
      expect(chart.data.datasets.length).toBe(2);
   });
});
