import { ComponentFixture } from '@angular/core/testing';
import { instance, mock, reset } from 'ts-mockito';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../../chart.module';
import { BrushKnobComponent } from './brush-knob.component';
import { InnerPostboyService } from '../../../../services/inner-postboy.service';
import { should } from '@artstesh/it-should';

describe('BrushKnobComponent', () => {
  const postboy = mock(InnerPostboyService);
  let fixture: ComponentFixture<BrushKnobComponent>;

  beforeEach(async () => {
    return MockBuilder(BrushKnobComponent, ChartModule).provide(MockProvider(InnerPostboyService, instance(postboy)));
  });

  beforeEach(() => {
    fixture = MockRender(BrushKnobComponent);
  });

  afterEach(() => {
    reset(postboy);
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
