import { ComponentFixture } from "@angular/core/testing";
import { ChartBrushSelectionAreaComponent } from "./chart-brush-selection-area.component";
import { instance, mock, reset, when } from "ts-mockito";
import { ReplaySubject } from "rxjs";
import Chart from "chart.js/auto";
import { MockBuilder, MockProvider, MockRender } from "ng-mocks";
import {ChartBrushService} from "../services/chart-brush.service";
import {SelectedAreaModel} from "../../models";

describe("ChartBrushSelectionAreaComponent", () => {
  let fixture: ComponentFixture<ChartBrushSelectionAreaComponent>;
  const brushService = mock(ChartBrushService);
  let parentChart$: ReplaySubject<Chart>;
  let SelectedArea$: ReplaySubject<SelectedAreaModel>;

  beforeEach(async () => {
    return MockBuilder(ChartBrushSelectionAreaComponent)
      .provide(MockProvider(ChartBrushService, instance(brushService)));
  });

  beforeEach(() => {
    parentChart$ = new ReplaySubject<Chart>(1);
    SelectedArea$ = new ReplaySubject<SelectedAreaModel>(1);
    when(brushService.SelectedArea$).thenReturn(SelectedArea$);
    when(brushService.parentChart$).thenReturn(parentChart$);
    fixture = MockRender(ChartBrushSelectionAreaComponent);
  });

  afterEach(() => {
    reset(brushService);
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
