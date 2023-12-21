import { ComponentFixture } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { Forger } from '@artstesh/forger';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { ChartConstants } from '../../../../models/chart-constants';
import { OrdinateAxisComponent } from './ordinate-axis.component';
import { OrdinateAxisFactory } from './ordinate-axis-factory.service';

describe('#chart-elements OrdinateAxisComponent', () => {
  let fixture: ComponentFixture<OrdinateAxisComponent>;
  const plateService = mock(ChartPlateService);
  const factory = mock(OrdinateAxisFactory);
  let chartInitialized$: EventEmitter<any>;

  beforeEach(async () => {
    chartInitialized$ = new EventEmitter();
    when(plateService.chartInitialized).thenReturn(chartInitialized$);
    return MockBuilder(OrdinateAxisComponent, ChartModule)
      .provide(MockProvider(OrdinateAxisFactory, instance(factory)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(OrdinateAxisComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(factory);
    reset(plateService);
    expect().nothing();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add the axis on chartInitialized', () => {
    const expectedScale = Forger.create<number>()!; // a trick to avoid huge obj creation
    when(factory.build(anything())).thenReturn(expectedScale as any);
    //
    chartInitialized$.next();
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(ChartConstants.LeftAxisId);
    should().true(scale === (expectedScale as any));
  });
});
