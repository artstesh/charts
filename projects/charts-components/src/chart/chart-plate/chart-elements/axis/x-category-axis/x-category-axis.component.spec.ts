import { ComponentFixture } from '@angular/core/testing';

import { XCategoryAxisComponent } from './x-category-axis.component';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { SettingsMapService } from '../../../../services/settings-map.service';
import { EventEmitter } from '@angular/core';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { Forger } from '@artstesh/forger';
import { should } from '@artstesh/it-should';

describe('#chart-elements XCategoryAxisComponent', () => {
  let fixture: ComponentFixture<XCategoryAxisComponent>;
  const plateService = mock(ChartPlateService);
  const mapService = mock(SettingsMapService);
  let chartInitialized$: EventEmitter<any>;

  beforeEach(async () => {
    chartInitialized$ = new EventEmitter();
    when(plateService.chartInitialized).thenReturn(chartInitialized$);
    return MockBuilder(XCategoryAxisComponent, ChartModule)
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
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the labels on chartInitialized', () => {
    const expectedScale = Forger.create<number>()!; // a trick to avoid huge obj creation
    when(mapService.xCategoryScale(anything())).thenReturn(expectedScale as any);
    //
    chartInitialized$.next();
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(XCategoryAxisComponent.id);
    should().true(scale === expectedScale);
  });
});
