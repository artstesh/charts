import { ComponentFixture } from "@angular/core/testing";
import { ChartAreaComponent } from "./chart-area.component";
import { EventEmitter } from "@angular/core";
import { Forger } from "@artstesh/forger";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { ReplaySubject } from "rxjs";
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { ChartService } from "../../../services";
import { ChartPlateComponent } from "../../chart-plate.component";
import { DateRangeModel } from "../../../models";
import { ChartModule } from "../../../chart.module";

describe('ChartAreaComponent', () => {
   let fixture: ComponentFixture<ChartAreaComponent>;
   let service = mock(ChartService);
  const parent = mock(ChartPlateComponent);
  let chartInitialized: EventEmitter<unknown>;
  let chart: any;
  let dateRange$: ReplaySubject<DateRangeModel>;

   beforeEach(async () => {
     dateRange$ = new ReplaySubject<DateRangeModel>();
     chart = { options: { plugins: {} }, data: {datasets: []} };
     chartInitialized = new EventEmitter();
     when(parent.chart).thenReturn(chart);
     when(parent.dateRange$).thenReturn(dateRange$);
     when(parent.chartInitialized).thenReturn(chartInitialized);
     return MockBuilder(ChartAreaComponent, ChartModule)
       .provide(MockProvider(ChartPlateComponent, instance(parent)))
       .provide(MockProvider(ChartService, instance(service)));
   });

   beforeEach(() => {
     fixture = MockRender(ChartAreaComponent);
   });

  afterEach(() => {
    reset(parent);
    reset(service);
  });

   it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
   });

   it('should add area on ngOnChanges', () => {
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(2);
      expect(parent.updateChart).toHaveBeenCalledTimes(2); //with removing previous
   });

   it("should add area's type properly", () => {
      parent.chart.data = { datasets: [] };
      //
      fixture.detectChanges();
      //
      const upper = parent.chart.data.datasets[0];
      const lower = parent.chart.data.datasets[1];
      expect(upper.type).toBe('line');
      expect(lower.type).toBe('line');
   });

   it("should add the area's data properly", () => {
     let expectedUpper = { x: Forger.create<number>()!, y: Forger.create<number>()! };
     let expectedLower = { x: Forger.create<number>()!, y: Forger.create<number>()! };
     fixture.componentInstance.upper = [expectedUpper];
     fixture.componentInstance.lower = [expectedLower];
      //
      fixture.detectChanges();
      //
     const upper = instance(parent).chart.data.datasets[0];
      const lower = instance(parent).chart.data.datasets[1];
      expect(upper.data[0]).toBe(expectedUpper.y);
      expect(lower.data[0]).toBe(expectedLower.y);
   });

   it("should add the area's name properly", () => {
      fixture.componentInstance.name = Forger.create<string>()!;
      //
      fixture.detectChanges();
      //
      const added = instance(parent).chart.data.datasets[0];
      expect(added.label).toBe(fixture.componentInstance.name);
   });

   it("should add the area's color properly", () => {
      const color1 = Forger.create<string>()!;
      const color2 = Forger.create<string>()!;
      fixture.componentInstance.colors = [color1, color2];
      when(service.getGradient(anything())).thenReturn(new CanvasGradient());
      //
      fixture.detectChanges();
      //
      const upper = instance(parent).chart.data.datasets[0];
      const lower = instance(parent).chart.data.datasets[1];
      expect(upper.backgroundColor).toBe(color1);
      expect(lower.backgroundColor).toBe(color2);
   });

   it("should add the area's gradient properly", () => {
      const color = Forger.create<string>()!;
      fixture.componentInstance.colors = [color, color];
     let gradient = new CanvasGradient();
     when(service.getGradient(anything())).thenReturn(gradient);
      //
      fixture.detectChanges();
      //
      const lower = instance(parent).chart.data.datasets[1];
      expect((lower as any).fill.below).toBe(gradient);
   });

   it("should add the area's yAxisId properly", () => {
      fixture.componentInstance.yAxisId = Forger.create<string>()!;
      //
      fixture.detectChanges();
      //
      const added = instance(parent).chart.data.datasets[0];
      expect((added as any).yAxisID).toBe(fixture.componentInstance.yAxisId);
   });

   it("should add the area's order properly", () => {
      fixture.componentInstance.order = Math.floor(Math.random() * 16777215);
      //
      fixture.detectChanges();
      //
      const added = instance(parent).chart.data.datasets[0];
      expect(added.order).toBe(fixture.componentInstance.order);
   });

   it('should not duplicate areas', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: fixture.componentInstance.order } as any] };
      //
      fixture.detectChanges();
      //
      expect(instance(parent).chart.data.datasets.length).toBe(2);
   });

   it('should not delete other areas by order', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: fixture.componentInstance.name, order: Forger.create<number>() } as any] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(3);
   });

   it('should not delete other areas by name', () => {
      fixture.componentInstance.name = 'Some name';
      fixture.componentInstance.order = 0;
      parent.chart.data = { datasets: [{ label: 'Other name', order: fixture.componentInstance.order } as any] };
      //
      fixture.detectChanges();
      //
      expect(parent.chart.data.datasets.length).toBe(3);
   });
});
