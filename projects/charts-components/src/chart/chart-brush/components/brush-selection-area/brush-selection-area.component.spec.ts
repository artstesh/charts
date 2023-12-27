import { ComponentFixture } from '@angular/core/testing';
import { instance, mock, reset, when } from 'ts-mockito';
import { ReplaySubject } from 'rxjs';
import Chart from 'chart.js/auto';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartPostboyService } from '../../../services/chart-postboy.service';
import { should } from '@artstesh/it-should';
import { BrushSelectionAreaComponent } from "./brush-selection-area.component";
import { ChartBrushService } from "../../services/chart-brush.service";
import { BrushRangeModel } from "../../models/brush-range.model";
import { ChartModule } from "../../../chart.module";

describe('ChartBrushSelectionAreaComponent', () => {
  let fixture: ComponentFixture<BrushSelectionAreaComponent>;
  const postboy = mock(ChartPostboyService);
  const brushService = mock(ChartBrushService);
  let parentChart$: ReplaySubject<Chart>;
  let SelectedArea$: ReplaySubject<BrushRangeModel>;

  beforeEach(async () => {
    return MockBuilder(BrushSelectionAreaComponent, ChartModule)
      .provide(MockProvider(ChartBrushService, instance(brushService)))
      .provide(MockProvider(ChartPostboyService, instance(postboy)));
  });

  beforeEach(() => {
    parentChart$ = new ReplaySubject<Chart>(1);
    SelectedArea$ = new ReplaySubject<BrushRangeModel>(1);
    when(brushService.SelectedArea$).thenReturn(SelectedArea$);
    fixture = MockRender(BrushSelectionAreaComponent);
  });

  afterEach(() => {
    reset(brushService);
    reset(postboy);
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
