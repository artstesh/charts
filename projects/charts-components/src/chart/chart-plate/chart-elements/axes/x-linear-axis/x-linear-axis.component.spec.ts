import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import {Forger} from "@artstesh/forger";
import {ReplaySubject} from "rxjs";
import { XLinearAxisComponent } from "./x-linear-axis.component";
import { DateRangeModel } from "../../../../models";
import { ChartPlateComponent } from "../../../chart-plate.component";
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { ChartModule } from "../../../../chart.module";

describe('#chart-elements XLinearAxisComponent', () => {
  let fixture: ComponentFixture<XLinearAxisComponent>;
  let parent: any;
  let dateRange$: ReplaySubject<DateRangeModel>;

  beforeEach(async () => {
    const chartStub = jasmine.createSpyObj(['update', 'data', 'options']);
    dateRange$ = new ReplaySubject<DateRangeModel>();
    parent = {
      chart: chartStub,
      chartInitialized: new EventEmitter(),
      updateChart: jasmine.createSpy('updateChart'),
      dateRange$: dateRange$
    };
    return MockBuilder(XLinearAxisComponent, ChartModule)
      .provide(MockProvider(ChartPlateComponent, parent));
  });

  beforeEach(() => {
    fixture = MockRender(XLinearAxisComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the axis on chartInitialized', () => {
    parent.chart.options.scales = {};
    //
    parent.chartInitialized.next();
    fixture.detectChanges();
    //
    expect(parent.chart.options.scales[XLinearAxisComponent.id]).toBeTruthy();
  });

  it('should update chart on chartInitialized', () => {
    parent.chart.options.scales = {};
    //
    parent.chartInitialized.next();
    fixture.detectChanges();
    //
    expect(parent.updateChart).toHaveBeenCalledTimes(1);
  });

  it('should add the grid display property', () => {
    parent.chart.options.scales = {};
    //
    fixture.componentInstance.displayGrid = true;
    parent.chartInitialized.next();
    fixture.detectChanges();
    //
    const gridProp = parent.chart.options.scales[XLinearAxisComponent.id].grid;
    expect(gridProp.display).toBe(fixture.componentInstance.displayGrid);
  });

  it('no min & max restrictions by default', () => {
    parent.chart.options.scales = {};
    //
    parent.chartInitialized.next();
    fixture.detectChanges();
    //
    expect(parent.chart.options.scales[XLinearAxisComponent.id].min).not.toBeTruthy();
    expect(parent.chart.options.scales[XLinearAxisComponent.id].max).not.toBeTruthy();
  });

  it('should add the min property', () => {
    parent.chart.options.scales = {};
    const updateModel: DateRangeModel = {minX: Forger.create<number>()!, maxX: Forger.create<number>()!};
    //
    parent.dateRange$.next(updateModel);
    fixture.detectChanges();
    //
    expect(parent.chart.options.scales[XLinearAxisComponent.id].min).toBe(updateModel.minX);
    expect(parent.chart.options.scales[XLinearAxisComponent.id].max).toBe(updateModel.maxX);
  });
});
