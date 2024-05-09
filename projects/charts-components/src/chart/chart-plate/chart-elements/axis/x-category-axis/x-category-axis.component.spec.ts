import { ComponentFixture } from '@angular/core/testing';

import { XCategoryAxisComponent } from './x-category-axis.component';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';
import { ChartPostboyService } from '../../../../services/chart-postboy.service';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';
import { Subject } from 'rxjs';

describe('#chart-elements XCategoryAxisComponent', () => {
  let fixture: ComponentFixture<XCategoryAxisComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(XCategoryAxisComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(SettingsMapService, instance(mapService)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(XCategoryAxisComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(plateService);
    reset(mapService);
    reset(postboy);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the labels on chartInitialized', () => {
    const expectedScale = Forger.create<number>()! as any; // a trick to avoid huge obj creation
    when(mapService.xCategoryScale(anything())).thenReturn(expectedScale);
    //
    chartInitialized.next(new ChartInitializedEvent(null as any));
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(XCategoryAxisComponent.id);
    should().true(scale === expectedScale);
  });
});
