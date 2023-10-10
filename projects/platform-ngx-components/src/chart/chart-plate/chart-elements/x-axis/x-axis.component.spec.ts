import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XAxisComponent } from './x-axis.component';
import { ChartPlateComponent } from '@cdk/chart/chart-plate/chart-plate.component';
import { EventEmitter } from '@angular/core';
import {Forger} from "@artstesh/forger";
import {DateRangeModel} from "@cdk/chart/chart-plate/models/date-range.model";
import {ReplaySubject} from "rxjs";

describe('XAxisComponent', () => {
   let component: XAxisComponent;
   let fixture: ComponentFixture<XAxisComponent>;
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
      await TestBed.configureTestingModule({
         declarations: [XAxisComponent],
         providers: [{ provide: ChartPlateComponent, useValue: parent }]
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(XAxisComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should add the axis on chartInitialized', () => {
      parent.chart.options.scales = {};
      //
      parent.chartInitialized.next();
      fixture.detectChanges();
      //
      expect(parent.chart.options.scales[XAxisComponent.id]).toBeTruthy();
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
      component.displayGrid = true;
      parent.chartInitialized.next();
      fixture.detectChanges();
      //
      const gridProp = parent.chart.options.scales[XAxisComponent.id].grid;
      expect(gridProp.display).toBe(component.displayGrid);
   });

   it('no min & max restrictions by default', () => {
      parent.chart.options.scales = {};
      //
      parent.chartInitialized.next();
      fixture.detectChanges();
      //
      expect(parent.chart.options.scales[XAxisComponent.id].min).not.toBeTruthy();
      expect(parent.chart.options.scales[XAxisComponent.id].max).not.toBeTruthy();
   });

   it('should add the min property', () => {
      parent.chart.options.scales = {};
      const updateModel: DateRangeModel = {minDate: Forger.create<Date>()!, maxDate: Forger.create<Date>()!};
      //
      parent.dateRange$.next(updateModel);
      fixture.detectChanges();
      //
      expect(parent.chart.options.scales[XAxisComponent.id].min).toBe(updateModel.minDate?.getTime());
     expect(parent.chart.options.scales[XAxisComponent.id].max).toBe(updateModel.maxDate?.getTime());
   });
});
