import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock, reset } from 'ts-mockito';
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import { ChartModule } from "../../../../chart.module";
import { ChartBrushService } from "../../../services/chart-brush.service";
import { BrushKnobComponent } from "./brush-knob.component";
import { ChartPostboyService } from "../../../../services/chart-postboy.service";
import { should } from "@artstesh/it-should";

describe('BrushKnobComponent', () => {
  const postboy = mock(ChartPostboyService);
  let fixture: ComponentFixture<BrushKnobComponent>;

  beforeEach(async () => {
    return MockBuilder(BrushKnobComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)));
  });

  beforeEach(() => {
    fixture = MockRender(BrushKnobComponent);
  });

  afterEach(() => {
    reset(postboy);
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
