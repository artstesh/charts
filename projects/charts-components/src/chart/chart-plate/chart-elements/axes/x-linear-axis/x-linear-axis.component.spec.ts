import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import {Forger} from "@artstesh/forger";
import {ReplaySubject} from "rxjs";
import { XLinearAxisComponent } from "./x-linear-axis.component";
import { DateRangeModel } from "../../../../models";
import { ChartPlateComponent } from "../../../chart-plate.component";
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { ChartModule } from "../../../../chart.module";
import { instance, mock, reset, when } from "ts-mockito";
import { ChartAxisLimitService } from "../../../../services/chart-axis-limit.service";
import { should } from "@artstesh/it-should";
import { ChartPlateService } from "../../../services/chart-plate.service";

describe('#chart-elements XLinearAxisComponent', () => {
  let fixture: ComponentFixture<XLinearAxisComponent>;
  const limitService = mock(ChartAxisLimitService);
  const chartPlate = mock(ChartPlateComponent);
  const plateService = mock(ChartPlateService);
  let chartInitialized$: EventEmitter<any>;

  beforeEach(async () => {
    chartInitialized$ = new EventEmitter();
    const chartStub = jasmine.createSpyObj(['update', 'data', 'options']);
    when(plateService.chartInitialized).thenReturn(chartInitialized$);
    when(chartPlate.chart).thenReturn(chartStub);
    return MockBuilder(XLinearAxisComponent, ChartModule)
      .provide(MockProvider(ChartAxisLimitService, instance(limitService)))
      .provide(MockProvider(ChartPlateComponent, instance(chartPlate)));
  });

  beforeEach(() => {
    fixture = MockRender(XLinearAxisComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(limitService);
    reset(plateService);
    expect().nothing();
  })

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the axis on chartInitialized', () => {
    instance(chartPlate).chart.options.scales = {};
    //
    chartInitialized$.next();
    fixture.detectChanges();
    //
    expect(instance(chartPlate).chart?.options?.scales?.[XLinearAxisComponent.id]).toBeTruthy();
  });

  it('should update chart on chartInitialized', () => {
    instance(chartPlate).chart.options.scales = {};
    //
    chartInitialized$.next();
    fixture.detectChanges();
    //
    expect(instance(chartPlate).updateChart).toHaveBeenCalledTimes(1);
  });

  it('should add the grid display property', () => {
    instance(chartPlate).chart.options.scales = {};
    //
    fixture.componentInstance._settings.displayGrid = true;
    chartInitialized$.next();
    fixture.detectChanges();
    //
    const gridProp = instance(chartPlate).chart?.options?.scales?.[XLinearAxisComponent.id]?.grid;
    expect(gridProp?.display).toBe(fixture.componentInstance._settings.displayGrid);
  });

  it('no min & max restrictions by default', () => {
    instance(chartPlate).chart.options.scales = {};
    //
    chartInitialized$.next();
    fixture.detectChanges();
    //
    expect(instance(chartPlate).chart.options.scales?.[XLinearAxisComponent.id]?.min).not.toBeTruthy();
    expect(instance(chartPlate).chart.options.scales?.[XLinearAxisComponent.id]?.max).not.toBeTruthy();
  });

  it('should add the min property', () => {
    instance(chartPlate).chart.options.scales = {};
    const updateModel: DateRangeModel = {minX: Forger.create<number>()!, maxX: Forger.create<number>()!};
    //
    fixture.detectChanges();
    //
    should().true(false);
  });
});
