import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartLineComponent } from './chart-line.component';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { anyString, instance, mock, when } from "ts-mockito";
import { ReplaySubject } from "rxjs";
import { ChartService } from "../../../services";
import { ChartPlateComponent } from "../../chart-plate.component";
import { DateRangeModel } from "../../../models";
import { ChartModule } from "../../../chart.module";

describe('#chart-types LineChartComponent', () => {
   let fixture: ComponentFixture<ChartLineComponent>;
  let service = mock(ChartService);
  const parent = mock(ChartPlateComponent);
  let chartInitialized: EventEmitter<unknown>;
  let chart: any;
  let dateRange$: ReplaySubject<DateRangeModel>;
   const color = '#000';

   beforeEach(async () => {
     dateRange$ = new ReplaySubject<DateRangeModel>();
     chart = { options: { plugins: {} }, data: {datasets: []} };
     chartInitialized = new EventEmitter();
     when(parent.chart).thenReturn(chart);
     when(parent.chartInitialized).thenReturn(chartInitialized);
     return MockBuilder(ChartLineComponent, ChartModule)
       .provide(MockProvider(ChartPlateComponent, instance(parent)))
       .provide(MockProvider(ChartService, instance(service)));
   });

   beforeEach(() => {
     dateRange$ = new ReplaySubject<DateRangeModel>();
     chart = { options: { plugins: {} }, data: {datasets: []} };
     chartInitialized = new EventEmitter();
     when(parent.chart).thenReturn(chart);
     when(parent.chartInitialized).thenReturn(chartInitialized);
      when(service.getRandomColor(anyString())).thenReturn(color);
     fixture = MockRender(ChartLineComponent);
   });

   it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
   });

   it('should define color if not defined', () => {
      parent.chartInitialized.next();
      //
      expect(fixture.componentInstance.color).toBe(color);
   });

   it('should add line on ngOnChanges', () => {
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(1);
      expect(parent.updateChart).toHaveBeenCalledTimes(1);
   });

   it("should add line's type properly", () => {
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.type).toBe('line');
   });
/*
   it("should add the line's data properly", () => {
      fixture.componentInstance.data = [{ x: new Date(), y: 1 }];
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.data).toBe(fixture.componentInstance.data);
   });
*/
   it("should add the line's name properly", () => {
      fixture.componentInstance.name = Math.floor(Math.random() * 16777215).toString(16);
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.label).toBe(fixture.componentInstance.name);
   });

   it("should add the line's color properly", () => {
      fixture.componentInstance.color = Math.floor(Math.random() * 16777215).toString(16);
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.backgroundColor).toBe(fixture.componentInstance.color);
      expect(added.borderColor).toBe(fixture.componentInstance.color);
   });
/*
   it("should add the line's yAxisId properly", () => {
      fixture.componentInstance.yAxisId = Math.floor(Math.random() * 16777215).toString(16);
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.yAxisID).toBe(fixture.componentInstance.yAxisId);
   });
*/
   it("should add the line's order properly", () => {
      fixture.componentInstance.order = Math.floor(Math.random() * 100);
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const added = parent.chart.data.datasets[0];
      expect(added.order).toBe(fixture.componentInstance.order);
   });
/*
   it('should add line do not duplicate lines', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: fixture.componentInstance.order }] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(1);
   });

   it('should add line do not delete other lines by order', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: Math.floor(Math.random() * 10) }] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(2);
   });

   it('should add line do not delete other lines by name', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: 'Other name', order: fixture.componentInstance.order }] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(2);
   });
 */
});
