import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YAxisComponent } from './y-axis.component';
import { ChartPlateComponent } from '../../chart-plate.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { Forger } from '@artstesh/forger';
import { instance, mock, verify, when } from 'ts-mockito';
import { ChartModule } from "../../../chart.module";

describe('YAxisComponent', () => {
   let component: YAxisComponent;
   let fixture: ComponentFixture<YAxisComponent>;
   const parent = mock(ChartPlateComponent);
   let chartInitialized: EventEmitter<unknown>;
   let chart: any;
   const id = Forger.create<string>({ stringSpecial: false })!;

   beforeEach(async () => {
      chart = { data: { datasets: [] }, options: {} };
      chartInitialized = new EventEmitter();
      when(parent.chartInitialized).thenReturn(chartInitialized);
      when(parent.chart).thenReturn(chart);
      return MockBuilder(YAxisComponent, ChartModule).provide(MockProvider(ChartPlateComponent, instance(parent)));
   });

   beforeEach(() => {
      fixture = MockRender(YAxisComponent, null, false);
      component = fixture.componentInstance;
      component.id = id;
      chart.options.scales = {};
      fixture.detectChanges();
   });

   it('should add the axis on ngOnChanges', () => {
      chart.options.scales = {};
      //
      component.ngOnChanges({});
      fixture.detectChanges();
      //
      expect(chart.options.scales[id]).toBeTruthy();
   });

   it('should update chart on chartInitialized', () => {
      chart.options.scales = {};
      //
      component.ngOnChanges({});
      //
      verify(parent.updateChart(true)).called();
   });

   it('should add the grid property', () => {
      chart.options.scales = {};
      const element = ngMocks.findInstance(YAxisComponent);
      //
      element.displayGrid = true;
      element.ngOnChanges({});
      //
      const gridProp = chart.options.scales[id].grid;
      expect(gridProp.display).toBe(element.displayGrid);
   });

   it('should add the position property', () => {
      chart.options.scales = {};
      const element = ngMocks.findInstance(YAxisComponent);
      //
      element.position = 'left';
      element.ngOnChanges({});
      //
      const position = chart.options.scales[id].position;
      expect(position).toBe(element.position);
   });
});
