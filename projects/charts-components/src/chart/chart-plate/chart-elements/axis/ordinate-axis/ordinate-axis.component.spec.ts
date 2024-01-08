import { ComponentFixture } from '@angular/core/testing';
import { Forger } from '@artstesh/forger';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { should } from '@artstesh/it-should';
import { ChartPlateService } from '../../../services/chart-plate.service';
import { ChartConstants } from '../../../../models/chart-constants';
import { OrdinateAxisComponent } from './ordinate-axis.component';
import { OrdinateAxisFactory } from './ordinate-axis-factory.service';
import { Subject } from 'rxjs';
import { ChartInitializedEvent } from '../../../../messages/events/chart-initialized.event';
import { ChartPostboyService } from '../../../../services/chart-postboy.service';

describe('#chart-elements OrdinateAxisComponent', () => {
  let fixture: ComponentFixture<OrdinateAxisComponent>;
  const plateService = mock(ChartPlateService);
  const factory = mock(OrdinateAxisFactory);
  const postboy = mock(ChartPostboyService);
  let chartInitialized: Subject<ChartInitializedEvent>;

  beforeEach(async () => {
    chartInitialized = new Subject<ChartInitializedEvent>();
    when(postboy.subscribe(ChartInitializedEvent.ID)).thenReturn(chartInitialized);
    return MockBuilder(OrdinateAxisComponent, ChartModule)
      .provide(MockProvider(ChartPostboyService, instance(postboy)))
      .provide(MockProvider(OrdinateAxisFactory, instance(factory)))
      .provide(MockProvider(ChartPlateService, instance(plateService)));
  });

  beforeEach(() => {
    fixture = MockRender(OrdinateAxisComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    reset(factory);
    reset(postboy);
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
    chartInitialized.next();
    fixture.detectChanges();
    //
    const [id, scale] = capture(plateService.setScale).last();
    should().string(id).equals(ChartConstants.LeftAxisId);
    should().true(scale === expectedScale);
  });
});
