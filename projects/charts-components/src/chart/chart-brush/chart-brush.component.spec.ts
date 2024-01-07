import { ComponentFixture } from '@angular/core/testing';

import { ChartBrushComponent } from './chart-brush.component';
import { mock } from 'ts-mockito';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ChartModule } from '../chart.module';
import { should } from '@artstesh/it-should';
import { BrushRegistratorService } from './services/brush-registrator.service';

describe('ChartBrushComponent', () => {
  let fixture: ComponentFixture<ChartBrushComponent>;

  beforeEach(async () => {
    return MockBuilder(ChartBrushComponent, ChartModule).mock(BrushRegistratorService, mock(BrushRegistratorService));
  });

  beforeEach(() => {
    fixture = MockRender(ChartBrushComponent);
  });

  afterEach(() => {
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
