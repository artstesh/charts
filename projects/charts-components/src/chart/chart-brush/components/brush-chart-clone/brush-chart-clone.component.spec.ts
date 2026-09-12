import { ComponentFixture } from '@angular/core/testing';

import { BrushChartCloneComponent } from './brush-chart-clone.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ChartModule } from '../../../chart.module';
import { InnerPostboyService } from '../../../services/inner-postboy.service';
import { should } from '@artstesh/it-should';
import { PostboyWorld } from '@artstesh/postboy-testing';

describe('BrushChartCloneComponent', () => {
  let fixture: ComponentFixture<BrushChartCloneComponent>;
  let world: PostboyWorld;

  beforeEach(async () => {
    world = new PostboyWorld();
    return MockBuilder(BrushChartCloneComponent, ChartModule).provide({
      provide: InnerPostboyService,
      useValue: world.postboy,
    });
  });

  beforeEach(() => {
    fixture = MockRender(BrushChartCloneComponent);
  });

  afterEach(() => {
    world.dispose();
    expect().nothing();
  });

  it('should create', () => {
    should().true(fixture.componentInstance);
  });
});
