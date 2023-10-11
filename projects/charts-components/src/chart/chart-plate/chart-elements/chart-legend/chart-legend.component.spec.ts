import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartLegendComponent } from './chart-legend.component';
import { EventEmitter } from '@angular/core';
import { anything, instance, mock, reset, verify, when } from "ts-mockito";
import {MockBuilder, MockProvider, MockRender} from 'ng-mocks';
import { should } from "@artstesh/it-should";
import {ChartPlateComponent} from "../../chart-plate.component";
import {ChartModule} from "../../../chart.module";

describe('ChartLegendComponent', () => {
   let fixture: ComponentFixture<ChartLegendComponent>;
   const parent = mock(ChartPlateComponent);
  let chartInitialized: EventEmitter<unknown>;
  let chart: any;

   beforeEach(async () => {
     chart = { options: { plugins: {} } };
     chartInitialized = new EventEmitter();
     when(parent.chart).thenReturn(chart);
     when(parent.chartInitialized).thenReturn(chartInitialized);
      return MockBuilder(ChartLegendComponent, ChartModule).provide(
         MockProvider(ChartPlateComponent, instance(parent))
      );
   });

   beforeEach(() => {
      fixture = MockRender(ChartLegendComponent);
   });

   afterEach(() => {
      reset(parent);
   });

   it('should add the legend on chartInitialized', () => {
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      expect(chart.options.plugins.legend).toBeTruthy();
   });

   it('should update chart on chartInitialized', () => {
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      verify(parent.updateChart()).twice();
   });

   it("should add legend's position properly", () => {
      fixture.componentInstance.position = 'left';
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      const legend = chart.options.plugins.legend;
      should().string(legend?.position).equals(fixture.componentInstance.position);
   });
});
