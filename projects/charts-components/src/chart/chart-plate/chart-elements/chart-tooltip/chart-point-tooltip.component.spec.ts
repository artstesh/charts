import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartPointTooltipComponent } from './chart-point-tooltip.component';
import { instance, mock, reset, when } from 'ts-mockito';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { EventEmitter } from '@angular/core';
import { ChartPlateComponent } from "../../chart-plate.component";
import { ChartModule } from "../../../chart.module";

describe('ChartTooltipComponent', () => {
   let component: ChartPointTooltipComponent;
   let fixture: ComponentFixture<ChartPointTooltipComponent>;
   const parent = mock(ChartPlateComponent);
   let chartInitialized: EventEmitter<unknown>;
   let chart: any;

   beforeEach(async () => {
      chart = { options: { plugins: {} } };
      chartInitialized = new EventEmitter();
      when(parent.chart).thenReturn(chart);
      when(parent.chartInitialized).thenReturn(chartInitialized);
      return MockBuilder(ChartPointTooltipComponent, ChartModule).provide(
         MockProvider(ChartPlateComponent, instance(parent))
      );
   });

   beforeEach(() => {
      fixture = MockRender(ChartPointTooltipComponent);
      component = ngMocks.findInstance(ChartPointTooltipComponent);
   });

   afterEach(() => {
      reset(parent);
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should add the tooltip on chartInitialized', () => {
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      expect(chart.options.plugins.tooltip).toBeTruthy();
   });

   it("should add tooltips's enabled properly", () => {
      component.enabled = true;
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      const tooltip = chart.options.plugins.tooltip;
      expect(tooltip?.enabled).not.toEqual(component.enabled);
   });

   it("should add tooltips's position properly", () => {
      component.position = 'average';
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      const tooltip = chart.options.plugins.tooltip;
      expect(tooltip?.position).toEqual(component.position);
   });

   it("should add tooltips's externalTooltipHandler", () => {
      chart.options.plugins = {};
      //
      chartInitialized.next();
      fixture.detectChanges();
      //
      const tooltip = chart.options.plugins.tooltip;
      expect(tooltip?.external).toBeTruthy();
   });
});
