import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartScatterComponent } from "./chart-scatter.component";
import { EventEmitter } from "@angular/core";
import { ChartPlateComponent } from "@cdk/chart/chart-plate/chart-plate.component";
import { ChartService } from "@cdk/chart/services/chart.service";
import { anyString, anything, instance, mock, reset, verify, when } from "ts-mockito";
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { ChartLegendComponent } from "@cdk/chart/chart-plate/chart-elements/chart-legend/chart-legend.component";
import { ChartModule } from "@cdk";
import { Forger } from "@artstesh/forger";
import { ReplaySubject } from "rxjs";
import { DateRangeModel } from "@cdk/chart/chart-plate/models/date-range.model";

describe("ChartScatterComponent", () => {
  let fixture: ComponentFixture<ChartScatterComponent>;
  const parent = mock(ChartPlateComponent);
  let service = mock(ChartService);
  const color = "#bbb";
  let chartInitialized: EventEmitter<unknown>;
  let chart: any;
  let dateRange$: ReplaySubject<DateRangeModel>;

  beforeEach(async () => {
    dateRange$ = new ReplaySubject<DateRangeModel>();
    chart = { options: { plugins: {} }, data: { datasets: [] } };
    chartInitialized = new EventEmitter();
    when(parent.chart).thenReturn(chart);
    when(parent.dateRange$).thenReturn(dateRange$);
    when(parent.chartInitialized).thenReturn(chartInitialized);
    when(service.getRandomColor(anyString())).thenReturn(color);
    return MockBuilder(ChartScatterComponent, ChartModule)
      .provide(MockProvider(ChartPlateComponent, instance(parent)))
      .provide(MockProvider(ChartService, instance(service)));
  });

  beforeEach(() => {
    fixture = MockRender(ChartScatterComponent, null, false);
    fixture.componentInstance.data = [];
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(parent);
    reset(service);
  });

  it("should define color if not defined", () => {
    chartInitialized.next();
    fixture.detectChanges();
    //
    expect(chart.data.datasets[0].backgroundColor).toBe(color);
    expect(chart.data.datasets[0].borderColor).toBe(color);
  });

  it("should add scatter on ngOnChanges", () => {
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    expect(chart.data.datasets.length).toBe(1);
    //verify(parent.updateChart(false)).once();
  });

  it("should add scatter's type properly", () => {
    chartInitialized.next();
    fixture.detectChanges();
    //
    const added = chart.data.datasets[0];
    expect(added.type).toBe("scatter");
  });

  it("should add the scatter's data properly", () => {
    fixture.componentInstance.data = [{ x: Forger.create<Date>()!, y: 1 }];
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    const added = chart.data.datasets[0];
    expect(added.data.length).toBe(fixture.componentInstance.data.length);
  });

  it("should add the scatter's name properly", () => {
    fixture.componentInstance.name = Forger.create<string>()!;
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    const added = chart.data.datasets[0];
    expect(added.label).toBe(fixture.componentInstance.name);
  });

  it("should add the scatter's order properly", () => {
    fixture.componentInstance.order = Forger.create<number>()!;
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    const added = chart.data.datasets[0];
    expect(added.order).toBe(fixture.componentInstance.order);
  });

  it("should add scatter do not duplicate scatters", () => {
    fixture.componentInstance.name = Forger.create<string>()!;
    fixture.componentInstance.order = 0;
    chart.data = { datasets: [{ label: fixture.componentInstance.name, order: fixture.componentInstance.order }] };
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    expect(chart.data.datasets.length).toBe(1);
  });

  it("should add scatter do not delete other scatters by order", () => {
    fixture.componentInstance.name = Forger.create<string>()!;
    fixture.componentInstance.order = 0;
    chart.data = { datasets: [{ label: fixture.componentInstance.name, order: Forger.create<number>()! }] };
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    expect(chart.data.datasets.length).toBe(1);
  });

  it("should add scatter do not delete other scatters by name", () => {
    fixture.componentInstance.name = Forger.create<string>()!;
    fixture.componentInstance.order = 0;
    chart.data = { datasets: [{ label: "Other name", order: fixture.componentInstance.order }] };
    //
    chartInitialized.next();
    fixture.detectChanges();
    //
    expect(chart.data.datasets.length).toBe(1);
  });
});
