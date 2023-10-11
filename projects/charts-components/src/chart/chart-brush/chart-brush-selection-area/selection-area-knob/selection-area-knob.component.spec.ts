import {ComponentFixture} from '@angular/core/testing';

import {SelectionAreaKnobComponent} from './selection-area-knob.component';
import {instance, mock, reset} from 'ts-mockito';
import {MockBuilder, MockProvider, MockRender} from "ng-mocks";
import {ChartModule} from "../../../chart.module";
import {ChartBrushService} from "../../services/chart-brush.service";

describe('SelectionAreaKnobComponent', () => {
   let fixture: ComponentFixture<SelectionAreaKnobComponent>;
   const brushService = mock(ChartBrushService);

   beforeEach(async () => {
     return MockBuilder(SelectionAreaKnobComponent, ChartModule)
       .provide(MockProvider(ChartBrushService, instance(brushService)));
   });

   beforeEach(() => {
     fixture = MockRender(SelectionAreaKnobComponent);
   });

   afterEach(() => {
      reset(brushService);
   });

   it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
   });
});
